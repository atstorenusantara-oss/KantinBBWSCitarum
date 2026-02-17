const express = require('express');
const router = express.Router();
const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

// Auth: Get Users (for login dropdown)
router.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT username, role FROM users');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Auth: Login
router.post('/login', async (req, res) => {
    try {
        const { username, pin } = req.body;
        const [rows] = await db.query('SELECT id, username, role FROM users WHERE username = ? AND pin = ?', [username, pin]);

        if (rows.length > 0) {
            const user = rows[0];
            const attendanceId = uuidv4();
            // Create attendance record on login
            await db.query('INSERT INTO attendance (id, user_id, clock_in) VALUES (?, ?, NOW())', [attendanceId, user.id]);

            res.json({ success: true, user: user, attendance_id: attendanceId });
        } else {
            res.status(401).json({ success: false, message: 'username atau PIN salah' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Auth: Logout (Clock out)
router.post('/logout', async (req, res) => {
    try {
        const { attendance_id } = req.body;
        if (attendance_id) {
            await db.query('UPDATE attendance SET clock_out = NOW() WHERE id = ?', [attendance_id]);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Logs: Get Attendance (Weekly)
router.get('/attendance', async (req, res) => {
    try {
        // Filter last 7 days
        const [rows] = await db.query(`
            SELECT a.*, u.username as staff_name 
            FROM attendance a 
            JOIN users u ON a.user_id = u.id 
            WHERE a.clock_in >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            ORDER BY a.clock_in DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Auth: Verify Admin (for Void - Optional now, but kept for other uses)
router.post('/verify-admin', async (req, res) => {
    try {
        const { pin } = req.body;
        const [rows] = await db.query('SELECT id FROM users WHERE role = "ADMIN" AND pin = ?', [pin]);

        if (rows.length > 0) {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'PIN Manager tidak valid' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Logs: Add Void Log
router.post('/void-log', async (req, res) => {
    try {
        const { user_id, product_name, price, reason } = req.body;
        await db.query(
            'INSERT INTO void_logs (id, user_id, product_name, price, reason) VALUES (?, ?, ?, ?, ?)',
            [uuidv4(), user_id, product_name, price, reason]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Logs: Get Void Logs (for Report)
router.get('/void-logs', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT vl.*, u.username as staff_name FROM void_logs vl LEFT JOIN users u ON vl.user_id = u.id ORDER BY vl.created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// AI: Get Anomaly Insights
router.get('/ai-insights', async (req, res) => {
    try {
        const insights = [];

        // 1. Get all materials that have recipes
        const [materials] = await db.query(`
            SELECT DISTINCT rm.id, rm.name, rm.unit, rm.stock as actual_stock
            FROM raw_materials rm
            JOIN product_recipes pr ON rm.id = pr.material_id
        `);

        for (const mat of materials) {
            // 2. Calculate theoretical usage from sales
            // We join sales -> sale_items -> recipes
            const [usage] = await db.query(`
                SELECT SUM(si.qty * pr.quantity) as total_used
                FROM sales_items si
                JOIN products p ON si.product_id = p.id
                JOIN product_recipes pr ON p.id = pr.product_id
                JOIN sales s ON si.sales_id = s.id
                WHERE pr.material_id = ? AND s.payment_status = 'PAID'
                AND s.created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            `, [mat.id]);

            const theoreticalUsed = Number(usage[0].total_used || 0);

            // 3. Get last opname to find starting point (simplified for now: check movements)
            const [movements] = await db.query(`
                SELECT SUM(qty) as total_in
                FROM stock_movements
                WHERE raw_material_id = ? AND type = 'IN'
                AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            `, [mat.id]);

            const totalIn = Number(movements[0].total_in || 0);

            // Heuristic Anomaly: If actual stock is much lower than (Starting + In - Used)
            // For this demo, let's look at the "Stock Movement" vs "Sales"
            // Actually, a simpler way: Check if (Total Used) is significantly different from (Total Out movements)
            const [recordedOut] = await db.query(`
                SELECT SUM(qty) as total_out
                FROM stock_movements
                WHERE raw_material_id = ? AND type = 'OUT'
                AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            `, [mat.id]);

            const actualOut = Number(recordedOut[0].total_out || 0);
            const diff = Math.abs(theoreticalUsed - actualOut);

            if (theoreticalUsed > 0 && diff > (theoreticalUsed * 0.15)) { // 15% threshold
                insights.push({
                    type: 'ANOMALY',
                    severity: 'HIGH',
                    message: `Anomali Penggunaan ${mat.name}: Terjual secara sistem setara ${theoreticalUsed.toFixed(2)} ${mat.unit}, namun stok berkurang ${actualOut.toFixed(2)} ${mat.unit}. Selisih ${(actualOut - theoreticalUsed).toFixed(2)} ${mat.unit} perlu diperiksa.`
                });
            }
        }

        // Add some generic insights if no anomalies
        if (insights.length === 0) {
            insights.push({
                type: 'INFO',
                severity: 'LOW',
                message: 'Stok dan penjualan saat ini terpantau sinkron. Belum ada anomali penggunaan bahan baku yang signifikan.'
            });
        }

        res.json({ success: true, data: insights });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
