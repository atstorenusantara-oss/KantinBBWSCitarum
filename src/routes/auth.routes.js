const express = require('express');
const router = express.Router();
const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');
const settingsService = require('../services/settings.service');

// Auth: Get Users (for login dropdown)
router.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT username, role 
            FROM users 
            WHERE username NOT IN ('KasirA', 'KasirB', 'KasirC', 'KasirD', 'KasirE', 'KasirF1', 'KasirF2')
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Auth: Login
router.post('/login', async (req, res) => {
    try {
        const { username, pin } = req.body;

        const [rows] = await db.query(`
            SELECT u.id, u.username, u.role, u.stand_id,
                   s.name as stand_name, s.code as stand_code, s.owner_name
            FROM users u
            LEFT JOIN stands s ON u.stand_id = s.id
            WHERE u.username = ? AND u.pin = ?
        `, [username, pin]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Username atau PIN salah' });
        }

        const user = rows[0];

        // Owner/Admin langsung login tanpa attendance
        if (user.role === 'ADMIN' || user.role === 'OWNER') {
            await settingsService.logActivity(user.id, 'LOGIN', `Owner/Admin ${user.username} logged in.`);
            return res.json({ success: true, user, attendance_id: null });
        }

        // Kasir: buat attendance record langsung (tidak ada jadwal)
        const attendanceId = uuidv4();
        await db.query(
            `INSERT INTO attendance (id, user_id, clock_in, status) VALUES (?, ?, NOW(), 'ACTIVE')`,
            [attendanceId, user.id]
        );
        await settingsService.logActivity(user.id, 'LOGIN', `Kasir ${user.username} (${user.stand_name || '-'}) login.`);
        return res.json({ success: true, user, attendance_id: attendanceId });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


// Auth: Logout (Clock out)
router.post('/logout', async (req, res) => {
    try {
        const { attendance_id } = req.body;
        if (attendance_id) {
            // Get attendance details
            const [attArr] = await db.query(`
                SELECT a.* 
                FROM attendance a 
                WHERE a.id = ?
            `, [attendance_id]);

            if (attArr.length > 0) {
                const att = attArr[0];
                const clockIn = new Date(att.clock_in);
                const clockOut = new Date();

                // Diff in minutes
                const diffMs = clockOut.getTime() - clockIn.getTime();
                const diffMins = Math.max(1, Math.round(diffMs / (1000 * 60))); // Min 1 minute for a shift

                const salary = 0;

                await db.query(`
                    UPDATE attendance 
                    SET clock_out = ?, duration_minutes = ?, salary_earned = ?, status = 'DONE' 
                    WHERE id = ?
                `, [clockOut, diffMins, salary, attendance_id]);

                // Log activity
                await settingsService.logActivity(att.user_id, 'LOGOUT', `User clocked out. Duration: ${diffMins} mins.`);
            }
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).json({ success: false, message: error.message });
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
        res.status(500).json({ success: false, message: error.message });
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
        res.status(500).json({ success: false, message: error.message });
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
        // Log to general activity log
        await settingsService.logActivity(user_id, 'VOID_ITEM', `Voided ${product_name} (Rp ${price}) reason: ${reason}`);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Logs: Get Void Logs (for Report)
router.get('/void-logs', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT vl.*, u.username as staff_name FROM void_logs vl LEFT JOIN users u ON vl.user_id = u.id ORDER BY vl.created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
                WHERE pr.material_id = ?
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
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin: Toggle Login Permission (Off-Schedule)
// Auth: Check Current Shift Status (always valid)
router.get('/shift-status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

        return res.json({ success: true, valid: true, reason: 'ALWAYS_VALID' });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;
