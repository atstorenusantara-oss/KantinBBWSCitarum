const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// GET /api/stands — semua stand aktif
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, COUNT(p.id) as total_products
            FROM stands s
            LEFT JOIN products p ON p.stand_id = s.id AND p.is_active = 1
            WHERE s.is_active = 1
            GROUP BY s.id
            ORDER BY s.code
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/stands/:id/summary — ringkasan penjualan per stand (untuk owner)
router.get('/:id/summary', async (req, res) => {
    try {
        const { id } = req.params;
        const { filter = 'day' } = req.query;
        const dayjs = require('dayjs');

        let startTime, endTime;
        if (filter === 'week') {
            startTime = dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        } else if (filter === 'month') {
            startTime = dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss');
            endTime = dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss');
        } else {
            startTime = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }

        const [revenue] = await db.query(`
            SELECT 
                COUNT(DISTINCT s.id) as total_transactions,
                SUM(si.qty * si.price) as total_revenue,
                SUM(CASE WHEN s.payment_method = 'CASH' THEN si.qty * si.price ELSE 0 END) as cash_revenue,
                SUM(CASE WHEN s.payment_method = 'QRIS' THEN si.qty * si.price ELSE 0 END) as qris_revenue
            FROM sales s
            JOIN sales_items si ON s.id = si.sales_id
            JOIN products p ON si.product_id = p.id
            WHERE p.stand_id = ? AND s.payment_status = 'PAID'
            AND s.created_at BETWEEN ? AND ?
        `, [id, startTime, endTime]);

        const [topProducts] = await db.query(`
            SELECT p.name, SUM(si.qty) as total_qty, SUM(si.qty * si.price) as total_revenue
            FROM sales_items si
            JOIN products p ON si.product_id = p.id
            JOIN sales s ON si.sales_id = s.id
            WHERE p.stand_id = ? AND s.payment_status = 'PAID'
            AND s.created_at BETWEEN ? AND ?
            GROUP BY p.id
            ORDER BY total_qty DESC
            LIMIT 5
        `, [id, startTime, endTime]);

        const [recentSales] = await db.query(`
            SELECT s.invoice_number, s.customer_name, 
                   SUM(si.qty * si.price) as total, 
                   s.payment_method, s.created_at,
                   u.username as staff_name
            FROM sales s
            JOIN sales_items si ON s.id = si.sales_id
            JOIN products p ON si.product_id = p.id
            LEFT JOIN users u ON s.creator_id = u.id
            WHERE p.stand_id = ? AND s.payment_status = 'PAID'
            AND s.created_at BETWEEN ? AND ?
            GROUP BY s.id
            ORDER BY s.created_at DESC
            LIMIT 10
        `, [id, startTime, endTime]);

        res.json({
            success: true,
            data: {
                revenue: revenue[0],
                top_products: topProducts,
                recent_sales: recentSales,
                period: { start: startTime, end: endTime }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
