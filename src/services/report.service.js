const db = require('../database/connection');
const dayjs = require('dayjs');

class ReportService {
    /**
     * Get Daily Report with flexible shift
     * @param {string} date - Date in 'YYYY-MM-DD' format
     * @param {number} shift - 1 (Morning) or 2 (Night)
     */
    async getDailyReport(date, shift = 1) {
        // Get shift settings from DB
        const [settingsArr] = await db.query('SELECT * FROM settings WHERE key_name LIKE "shift_%"');
        const settings = {};
        settingsArr.forEach(s => settings[s.key_name] = s.value);

        let startTime, endTime;

        if (shift == 1) {
            // Shift 1: 06:00 - 17:00 (Today)
            const [startH, startM] = (settings.shift_1_start || '06:00').split(':');
            const [endH, endM] = (settings.shift_1_end || '17:00').split(':');

            startTime = dayjs(date).hour(parseInt(startH)).minute(parseInt(startM)).second(0).format('YYYY-MM-DD HH:mm:ss');
            endTime = dayjs(date).hour(parseInt(endH)).minute(parseInt(endM)).second(0).format('YYYY-MM-DD HH:mm:ss');
        } else {
            // Shift 2: 17:00 (Today) - 03:00 (Next Day)
            const [startH, startM] = (settings.shift_1_end || '17:00').split(':');
            const [endH, endM] = (settings.shift_2_end || '03:00').split(':');

            startTime = dayjs(date).hour(parseInt(startH)).minute(parseInt(startM)).second(0).format('YYYY-MM-DD HH:mm:ss');
            endTime = dayjs(date).add(1, 'day').hour(parseInt(endH)).minute(parseInt(endM)).second(0).format('YYYY-MM-DD HH:mm:ss');
        }

        const query = `
            SELECT 
                COUNT(id) as total_transactions,
                SUM(total) as gross_revenue,
                AVG(total) as avg_transaction
            FROM sales 
            WHERE created_at BETWEEN ? AND ? AND payment_status = 'PAID'
        `;

        const [summary] = await db.query(query, [startTime, endTime]);

        // Payment Method Breakdown
        const paymentQuery = `
            SELECT payment_method, SUM(total) as total_amount
            FROM sales 
            WHERE created_at BETWEEN ? AND ? AND payment_status = 'PAID'
            GROUP BY payment_method
        `;
        const [payments] = await db.query(paymentQuery, [startTime, endTime]);

        // Best selling products for this shift
        const productQuery = `
            SELECT p.name, SUM(si.qty) as total_qty
            FROM sales_items si
            JOIN products p ON si.product_id = p.id
            JOIN sales s ON si.sales_id = s.id
            WHERE s.created_at BETWEEN ? AND ? AND s.payment_status = 'PAID'
            GROUP BY p.id
            ORDER BY total_qty DESC
            LIMIT 5
        `;
        const [topProducts] = await db.query(productQuery, [startTime, endTime]);

        // Pending Sales (Unpaid) for this shift
        const pendingQuery = `
            SELECT customer_name, total
            FROM sales 
            WHERE created_at BETWEEN ? AND ? AND payment_status = 'PENDING'
            ORDER BY created_at ASC
        `;
        const [pendingSales] = await db.query(pendingQuery, [startTime, endTime]);

        // Recent transactions for this shift (Limited to 20)
        const recentSalesQuery = `
            SELECT id, invoice_number, customer_name, total, payment_method, payment_status, created_at
            FROM sales 
            WHERE created_at BETWEEN ? AND ?
            ORDER BY created_at DESC
            LIMIT 20
        `;
        const [recentSales] = await db.query(recentSalesQuery, [startTime, endTime]);

        return {
            period: 'Daily (Shift)',
            start: startTime,
            end: endTime,
            summary: summary[0],
            payments: payments,
            top_products: topProducts,
            pending_sales: pendingSales,
            recent_sales: recentSales
        };
    }

    async getWeeklyReport() {
        const startTime = dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');

        const [summary] = await db.query(`
            SELECT COUNT(id) as total_transactions, SUM(total) as gross_revenue
            FROM sales WHERE created_at BETWEEN ? AND ? AND payment_status = 'PAID'
        `, [startTime, endTime]);

        return { period: 'Weekly (Last 7 Days)', summary: summary[0] };
    }

    async getMonthlyReport() {
        const startTime = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
        const endTime = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');

        const [summary] = await db.query(`
            SELECT COUNT(id) as total_transactions, SUM(total) as gross_revenue
            FROM sales WHERE created_at BETWEEN ? AND ? AND payment_status = 'PAID'
        `, [startTime, endTime]);

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
}

module.exports = new ReportService();
