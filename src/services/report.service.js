const db = require('../database/connection');
const dayjs = require('dayjs');

class ReportService {
    /**
     * Get Daily/Range Report with combined shift
     * @param {string} startDate - Start Date in 'YYYY-MM-DD' format
     * @param {string} endDate - End Date in 'YYYY-MM-DD' format
     * @param {string} standId - Stand ID or 'ALL'
     */
    async getDailyReport(startDate, endDate, standId = 'ALL') {
        // Get shift settings from DB
        const [settingsArr] = await db.query('SELECT * FROM settings WHERE key_name LIKE "shift_%"');
        const settings = {};
        settingsArr.forEach(s => settings[s.key_name] = s.value);

        let startTime, endTime;

        // Combined Shift (Full Business Day): 06:00 (Start Date) - 03:00 (End Date + 1 Day)
        const [startH, startM] = (settings.shift_1_start || '06:00').split(':');
        const [endH, endM] = (settings.shift_2_end || '03:00').split(':');

        startTime = dayjs(startDate).hour(parseInt(startH)).minute(parseInt(startM)).second(0).format('YYYY-MM-DD HH:mm:ss');
        endTime = dayjs(endDate).add(1, 'day').hour(parseInt(endH)).minute(parseInt(endM)).second(0).format('YYYY-MM-DD HH:mm:ss');


        let query, params;
        if (standId === 'ALL') {
            query = `
                SELECT 
                    COUNT(id) as total_transactions,
                    SUM(total) as gross_revenue,
                    AVG(total) as avg_transaction
                FROM sales 
                WHERE created_at BETWEEN ? AND ? AND payment_status = 'PAID'
            `;
            params = [startTime, endTime];
        } else {
            // Filter by product stand for accurate multi-stand attribution
            query = `
                SELECT 
                    COUNT(DISTINCT s.id) as total_transactions,
                    SUM(si.qty * si.price) as gross_revenue,
                    AVG(s.total) as avg_transaction
                FROM sales s
                JOIN sales_items si ON s.id = si.sales_id
                JOIN products p ON si.product_id = p.id
                WHERE s.created_at BETWEEN ? AND ? 
                AND s.payment_status = 'PAID' 
                AND p.stand_id = ?
            `;
            params = [startTime, endTime, standId];
        }

        const [summary] = await db.query(query, params);

        // Payment Method Breakdown
        let paymentQuery, paymentParams;
        if (standId === 'ALL') {
            paymentQuery = `
                SELECT 
                    SUM(CASE WHEN payment_method = 'CASH' THEN total ELSE 0 END) as raw_cash,
                    SUM(CASE WHEN payment_method = 'QRIS' THEN total ELSE 0 END) as raw_qris,
                    SUM(qris_exchange) as total_exchange
                FROM sales 
                WHERE created_at BETWEEN ? AND ? AND payment_status = 'PAID'
            `;
            paymentParams = [startTime, endTime];
        } else {
            paymentQuery = `
                SELECT 
                    SUM(CASE WHEN s.payment_method = 'CASH' THEN si.qty * si.price ELSE 0 END) as raw_cash,
                    SUM(CASE WHEN s.payment_method = 'QRIS' THEN si.qty * si.price ELSE 0 END) as raw_qris,
                    0 as total_exchange
                FROM sales s
                JOIN sales_items si ON s.id = si.sales_id
                JOIN products p ON si.product_id = p.id
                WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PAID' AND p.stand_id = ?
            `;
            paymentParams = [startTime, endTime, standId];
        }
        const [paymentSummary] = await db.query(paymentQuery, paymentParams);
        const { raw_cash, raw_qris, total_exchange } = paymentSummary[0];

        const payments = [
            { payment_method: 'CASH', total_amount: (Number(raw_cash) || 0) - (Number(total_exchange) || 0) },
            { payment_method: 'QRIS', total_amount: (Number(raw_qris) || 0) + (Number(total_exchange) || 0) }
        ];

        // All products sold for this shift
        let allProductQuery, allProductParams;
        if (standId === 'ALL') {
            allProductQuery = `
                SELECT p.name, si.qty as total_qty, si.price as unit_price, s.payment_method, s.payment_status, s.created_at, st.name as stand_name
                FROM sales_items si
                JOIN products p ON si.product_id = p.id
                JOIN sales s ON si.sales_id = s.id
                LEFT JOIN stands st ON p.stand_id = st.id
                WHERE s.created_at BETWEEN ? AND ?
                GROUP BY s.id, si.id
                ORDER BY s.created_at DESC
            `;
            allProductParams = [startTime, endTime];
        } else {
            allProductQuery = `
                SELECT p.name, si.qty as total_qty, si.price as unit_price, s.payment_method, s.payment_status, s.created_at, st.name as stand_name
                FROM sales_items si
                JOIN products p ON si.product_id = p.id
                JOIN sales s ON si.sales_id = s.id
                LEFT JOIN stands st ON p.stand_id = st.id
                WHERE s.created_at BETWEEN ? AND ? AND p.stand_id = ?
                GROUP BY s.id, si.id
                ORDER BY s.created_at DESC
            `;
            allProductParams = [startTime, endTime, standId];
        }
        const [allProducts] = await db.query(allProductQuery, allProductParams);

        // Stock Added (IN) for this shift
        const stockInQuery = `
            SELECT rm.name, ABS(SUM(sm.qty)) as total_qty, rm.unit
            FROM stock_movements sm
            JOIN raw_materials rm ON sm.raw_material_id = rm.id
            WHERE sm.type = 'IN' AND sm.created_at BETWEEN ? AND ?
            GROUP BY rm.id
        `;
        const [stockAdded] = await db.query(stockInQuery, [startTime, endTime]);

        // Stock Used (OUT) for this shift
        const stockOutQuery = `
            SELECT rm.name, ABS(SUM(sm.qty)) as total_qty, rm.unit
            FROM stock_movements sm
            JOIN raw_materials rm ON sm.raw_material_id = rm.id
            WHERE sm.type = 'OUT' AND sm.created_at BETWEEN ? AND ?
            GROUP BY rm.id
        `;
        const [stockUsed] = await db.query(stockOutQuery, [startTime, endTime]);

        // Stock Adjustments (ADJUST) for this shift
        const stockAdjustQuery = `
            SELECT rm.name, SUM(so.difference) as total_qty, rm.unit,
                   GROUP_CONCAT(so.note SEPARATOR ' | ') as notes,
                   MIN(so.is_resolved) as all_resolved,
                   GROUP_CONCAT(so.id) as opname_ids
            FROM stock_opnames so
            JOIN raw_materials rm ON so.raw_material_id = rm.id
            WHERE so.created_at BETWEEN ? AND ?
            GROUP BY rm.id
        `;
        const [stockAdjust] = await db.query(stockAdjustQuery, [startTime, endTime]);

        // Pending Sales (Unpaid) for this shift
        let pendingQuery, pendingParams;
        if (standId === 'ALL') {
            pendingQuery = `
                SELECT customer_name, total
                FROM sales 
                WHERE created_at BETWEEN ? AND ? AND payment_status = 'PENDING'
                ORDER BY created_at ASC
            `;
            pendingParams = [startTime, endTime];
        } else {
            pendingQuery = `
                SELECT DISTINCT s.customer_name, s.total
                FROM sales s
                JOIN sales_items si ON s.id = si.sales_id
                JOIN products p ON si.product_id = p.id
                WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PENDING' AND p.stand_id = ?
                ORDER BY s.created_at ASC
            `;
            pendingParams = [startTime, endTime, standId];
        }
        const [pendingSales] = await db.query(pendingQuery, pendingParams);

        // Recent transactions for this shift (Limited to 20)
        let recentSalesQuery, recentSalesParams;
        if (standId === 'ALL') {
            recentSalesQuery = `
                SELECT id, invoice_number, customer_name, total, payment_method, payment_status, created_at
                FROM sales 
                WHERE created_at BETWEEN ? AND ?
                ORDER BY created_at DESC
                LIMIT 20
            `;
            recentSalesParams = [startTime, endTime];
        } else {
            recentSalesQuery = `
                SELECT DISTINCT s.id, s.invoice_number, s.customer_name, s.total, s.payment_method, s.payment_status, s.created_at
                FROM sales s
                JOIN sales_items si ON s.id = si.sales_id
                JOIN products p ON si.product_id = p.id
                WHERE s.created_at BETWEEN ? AND ? AND p.stand_id = ?
                ORDER BY s.created_at DESC
                LIMIT 20
            `;
            recentSalesParams = [startTime, endTime, standId];
        }
        const [recentSales] = await db.query(recentSalesQuery, recentSalesParams);

        // All inventory (for current status)
        const [inventory] = await db.query('SELECT name, stock, unit FROM raw_materials ORDER BY name ASC');

        return {
            period: 'Daily (Shift)',
            start: startTime,
            end: endTime,
            summary: summary[0],
            payments: payments,
            all_products: allProducts,
            stock_added: stockAdded,
            stock_used: stockUsed,
            stock_adjust: stockAdjust,
            inventory: inventory,
            pending_sales: pendingSales,
            recent_sales: recentSales
        };
    }

    async getWeeklyReport(standId = 'ALL') {
        const startTime = dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        
        let query, params;
        if (standId === 'ALL') {
            query = `
                SELECT COUNT(id) as total_transactions, SUM(total) as gross_revenue
                FROM sales 
                WHERE created_at BETWEEN ? AND ? AND payment_status = 'PAID'
            `;
            params = [startTime, endTime];
        } else {
            query = `
                SELECT COUNT(DISTINCT s.id) as total_transactions, SUM(si.qty * si.price) as gross_revenue
                FROM sales s
                JOIN sales_items si ON s.id = si.sales_id
                JOIN products p ON si.product_id = p.id
                WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PAID' AND p.stand_id = ?
            `;
            params = [startTime, endTime, standId];
        }

        const [summary] = await db.query(query, params);
        return { period: 'Weekly (Last 7 Days)', summary: summary[0] };
    }

    async getMonthlyReport(standId = 'ALL') {
        const startTime = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
        const endTime = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');
        
        let query, params;
        if (standId === 'ALL') {
            query = `
                SELECT COUNT(id) as total_transactions, SUM(total) as gross_revenue
                FROM sales 
                WHERE created_at BETWEEN ? AND ? AND payment_status = 'PAID'
            `;
            params = [startTime, endTime];
        } else {
            query = `
                SELECT COUNT(DISTINCT s.id) as total_transactions, SUM(si.qty * si.price) as gross_revenue
                FROM sales s
                JOIN sales_items si ON s.id = si.sales_id
                JOIN products p ON si.product_id = p.id
                WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PAID' AND p.stand_id = ?
            `;
            params = [startTime, endTime, standId];
        }

        const [summary] = await db.query(query, params);
        return { period: 'Monthly (Current Month)', summary: summary[0] };
    }

    /**
     * Get Current Inventory Status
     */
    async getInventoryStatus() {
        const [rows] = await db.query(`
            SELECT name, stock, unit 
            FROM raw_materials 
            ORDER BY name ASC
        `);
        return rows;
    }

    async getOwnerSummary(startDateStr, endDateStr, standId = 'ALL') {
        let startTime, endTime;
        
        if (startDateStr && endDateStr) {
            startTime = dayjs(startDateStr).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endTime = dayjs(endDateStr).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        } else {
            startTime = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }

        const isGlobal = standId === 'ALL';
        
        // Revenue Breakdown
        let revenue;
        if (isGlobal) {
            const [revRows] = await db.query(`
                SELECT 
                    SUM(CASE WHEN payment_method = 'CASH' THEN total ELSE 0 END) - SUM(qris_exchange) as cash_revenue,
                    SUM(CASE WHEN payment_method = 'QRIS' THEN total ELSE 0 END) + SUM(qris_exchange) as qris_revenue,
                    SUM(total) as total_revenue
                FROM sales 
                WHERE created_at BETWEEN ? AND ? AND payment_status = 'PAID'
            `, [startTime, endTime]);
            revenue = revRows;
        } else {
            const [revRows] = await db.query(`
                SELECT 
                    SUM(CASE WHEN s.payment_method = 'CASH' THEN si.qty * si.price ELSE 0 END) as cash_revenue,
                    SUM(CASE WHEN s.payment_method = 'QRIS' THEN si.qty * si.price ELSE 0 END) as qris_revenue,
                    SUM(si.qty * si.price) as total_revenue
                FROM sales s
                JOIN sales_items si ON s.id = si.sales_id
                JOIN products p ON si.product_id = p.id
                WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PAID' AND p.stand_id = ?
            `, [startTime, endTime, standId]);
            revenue = revRows;
        }

        // HPP / COGS calculation
        let cogs;
        if (isGlobal) {
            const [cogsRows] = await db.query(`
                SELECT SUM(si.qty * COALESCE(si.cost_price, 0)) as total_cogs
                FROM sales_items si
                JOIN sales s ON si.sales_id = s.id
                WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PAID'
            `, [startTime, endTime]);
            cogs = cogsRows;
        } else {
            const [cogsRows] = await db.query(`
                SELECT SUM(si.qty * COALESCE(si.cost_price, 0)) as total_cogs
                FROM sales_items si
                JOIN products p ON si.product_id = p.id
                JOIN sales s ON si.sales_id = s.id
                WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PAID' AND p.stand_id = ?
            `, [startTime, endTime, standId]);
            cogs = cogsRows;
        }
        const totalCogs = Number(cogs[0]?.total_cogs || 0);

        // Expenses breakdown (Currently global, but can be tied to stands later)
        const [expenses] = await db.query(`
            SELECT 
                SUM(CASE WHEN type = 'BAHAN_BAKU' THEN amount ELSE 0 END) as raw_material,
                SUM(CASE WHEN type = 'LAINNYA' THEN amount ELSE 0 END) as others,
                SUM(amount) as manual_total
            FROM expenses
            WHERE created_at BETWEEN ? AND ?
        `, [startTime, endTime]);

        // Attendance-based Salary (Disabled)
        const totalSalary = 0;
        const totalExpense = isGlobal 
            ? (Number(expenses[0]?.manual_total || 0) + totalSalary + totalCogs) 
            : totalCogs;

        // Chart Data (Last 7 Days - Always 7 days trend)
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = dayjs().subtract(i, 'day');
            const start = d.startOf('day').format('YYYY-MM-DD HH:mm:ss');
            const end = d.endOf('day').format('YYYY-MM-DD HH:mm:ss');

            let dayRev = 0;
            let dayCogs = 0;

            if (isGlobal) {
                const [rev] = await db.query(`SELECT SUM(total) as total FROM sales WHERE created_at BETWEEN ? AND ? AND payment_status = 'PAID'`, [start, end]);
                const [cogsRes] = await db.query(`
                    SELECT SUM(si.qty * COALESCE(si.cost_price, 0)) as total_cogs
                    FROM sales_items si
                    JOIN sales s ON si.sales_id = s.id
                    WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PAID'
                `, [start, end]);
                dayRev = Number(rev[0].total || 0);
                dayCogs = Number(cogsRes[0]?.total_cogs || 0);
            } else {
                const [rev] = await db.query(`
                    SELECT SUM(si.qty * si.price) as total 
                    FROM sales s
                    JOIN sales_items si ON s.id = si.sales_id
                    JOIN products p ON si.product_id = p.id
                    WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PAID' AND p.stand_id = ?
                `, [start, end, standId]);
                const [cogsRes] = await db.query(`
                    SELECT SUM(si.qty * COALESCE(si.cost_price, 0)) as total_cogs
                    FROM sales_items si
                    JOIN products p ON si.product_id = p.id
                    JOIN sales s ON si.sales_id = s.id
                    WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PAID' AND p.stand_id = ?
                `, [start, end, standId]);
                dayRev = Number(rev[0].total || 0);
                dayCogs = Number(cogsRes[0]?.total_cogs || 0);
            }

            const [manualExp] = await db.query(`SELECT SUM(amount) as total FROM expenses WHERE created_at BETWEEN ? AND ?`, [start, end]);

            const dayExp = isGlobal 
                ? (Number(manualExp[0].total || 0) + dayCogs) 
                : dayCogs;

            chartData.push({
                date: d.format('DD MMM'),
                income: dayRev,
                expense: dayExp
            });
        }

        // Top Profit Contributors
        let topProfitQuery;
        let topParams = [startTime, endTime];
        if (isGlobal) {
            topProfitQuery = `
                SELECT 
                    p.name, 
                    s.name as stand_name,
                    SUM(si.qty) as total_qty, 
                    SUM(si.qty * (si.price - COALESCE(si.cost_price, 0))) as total_profit
                FROM sales_items si
                JOIN products p ON si.product_id = p.id
                LEFT JOIN stands s ON p.stand_id = s.id
                JOIN sales sa ON si.sales_id = sa.id
                WHERE sa.created_at BETWEEN ? AND ? AND sa.payment_status = 'PAID'
                GROUP BY p.id, s.id
                ORDER BY total_profit DESC
                LIMIT 5
            `;
        } else {
            topProfitQuery = `
                SELECT 
                    p.name, 
                    'Selected Stand' as stand_name,
                    SUM(si.qty) as total_qty, 
                    SUM(si.qty * (si.price - COALESCE(si.cost_price, 0))) as total_profit
                FROM sales_items si
                JOIN products p ON si.product_id = p.id
                JOIN sales sa ON si.sales_id = sa.id
                WHERE sa.created_at BETWEEN ? AND ? AND sa.payment_status = 'PAID' AND p.stand_id = ?
                GROUP BY p.id
                ORDER BY total_profit DESC
                LIMIT 5
            `;
            topParams.push(standId);
        }
        const [topProfitContributors] = await db.query(topProfitQuery, topParams);

        return {
            today: {
                revenue: revenue[0] || { cash_revenue: 0, qris_revenue: 0, total_revenue: 0 },
                expense: {
                    raw_material: isGlobal ? (expenses[0]?.raw_material || 0) : 0,
                    cogs: totalCogs,
                    salary: totalSalary,
                    others: isGlobal ? (expenses[0]?.others || 0) : 0,
                    total_expense: totalExpense
                },
                profit: (Number(revenue[0]?.total_revenue || 0)) - totalExpense
            },
            chart: chartData,
            top_profit_contributors: topProfitContributors
        };
    }
}

module.exports = new ReportService();
