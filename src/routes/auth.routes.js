const express = require('express');
const router = express.Router();
const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');
const settingsService = require('../services/settings.service');

// Auth: Get Users (for login dropdown)
router.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT username, role FROM users');
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
            // Get attendance details and user's rate
            const [attArr] = await db.query(`
                SELECT a.*, u.rate_per_minute 
                FROM attendance a 
                JOIN users u ON a.user_id = u.id 
                WHERE a.id = ?
            `, [attendance_id]);

            if (attArr.length > 0) {
                const att = attArr[0];
                const clockIn = new Date(att.clock_in);
                const clockOut = new Date();

                // Diff in minutes
                const diffMs = clockOut.getTime() - clockIn.getTime();
                const diffMins = Math.max(1, Math.round(diffMs / (1000 * 60))); // Min 1 minute for a shift

                const salary = diffMins * (att.rate_per_minute || 0);

                await db.query(`
                    UPDATE attendance 
                    SET clock_out = ?, duration_minutes = ?, salary_earned = ?, status = 'DONE' 
                    WHERE id = ?
                `, [clockOut, diffMins, salary, attendance_id]);

                // Log activity
                await settingsService.logActivity(att.user_id, 'LOGOUT', `User clocked out. Duration: ${diffMins} mins, Earned: Rp ${salary}.`);
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
router.post('/toggle-login-permission', async (req, res) => {
    try {
        const { userId, allow } = req.body;
        await db.query('UPDATE users SET allow_off_schedule = ? WHERE id = ?', [allow ? 1 : 0, userId]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Admin: Get all users with rates and permissions
router.get('/full-users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, role, rate_per_minute, allow_off_schedule FROM users');
        res.json({ success: true, data: rows });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Admin: Update User Rate per minute
router.post('/update-rate', async (req, res) => {
    try {
        const { userId, rate } = req.body;
        await db.query('UPDATE users SET rate_per_minute = ? WHERE id = ?', [rate, userId]);
        // Also log activity
        await settingsService.logActivity(userId, 'UPDATE_RATE', `Salary rate updated to Rp ${rate}/min`);
        res.json({ success: true, message: 'Rate gaji berhasil diperbarui' });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Admin: Add Manual Attendance
router.post('/attendance/manual', async (req, res) => {
    try {
        const { userId, clockIn, clockOut } = req.body;
        const [user] = await db.query('SELECT rate_per_minute FROM users WHERE id = ?', [userId]);
        if (!user.length) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

        const start = new Date(clockIn);
        const end = new Date(clockOut);
        const diffMs = end.getTime() - start.getTime();
        const diffMins = Math.max(0, Math.round(diffMs / (1000 * 60)));
        const overtimeReward = Number(req.body.overtimeReward || 0);
        const latePenalty = Number(req.body.latePenalty || 0);
        const salary = (diffMins * (user[0].rate_per_minute || 0)) + overtimeReward - latePenalty;

        // Determine status: If start is in the future, it's a schedule
        const status = start > new Date() ? 'PLANNED' : 'DONE';

        await db.query(`
            INSERT INTO attendance (id, user_id, clock_in, clock_out, duration_minutes, overtime_reward, late_penalty, salary_earned, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [uuidv4(), userId, start, end, diffMins, overtimeReward, latePenalty, salary, status]);

        res.json({ success: true, message: status === 'PLANNED' ? 'Jadwal berhasil dibuat' : 'Shift manual berhasil ditambahkan' });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Admin: Update Attendance
router.put('/attendance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { clockIn, clockOut, overtimeReward, latePenalty } = req.body;

        const [attDetails] = await db.query('SELECT user_id, clock_in, clock_out, overtime_reward, late_penalty FROM attendance WHERE id = ?', [id]);
        if (!attDetails.length) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });

        const finalClockIn = clockIn ? new Date(clockIn) : new Date(attDetails[0].clock_in);
        const finalClockOut = clockOut && clockOut !== 'null' ? new Date(clockOut) : (attDetails[0].clock_out ? new Date(attDetails[0].clock_out) : null);

        const finalOvertime = req.body.overtimeReward !== undefined ? overtimeReward : (attDetails[0].overtime_reward || 0);
        const finalLate = req.body.latePenalty !== undefined ? latePenalty : (attDetails[0].late_penalty || 0);

        let diffMins = 0;
        let salary = 0;

        const [user] = await db.query('SELECT rate_per_minute FROM users WHERE id = ?', [attDetails[0].user_id]);

        if (finalClockOut) {
            const diffMs = finalClockOut.getTime() - finalClockIn.getTime();
            diffMins = Math.max(0, Math.round(diffMs / (1000 * 60)));
            salary = (diffMins * (user[0].rate_per_minute || 0)) + finalOvertime - finalLate;
        } else {
            // Still active, salary is just the net reward for now or 0
            salary = finalOvertime - finalLate;
        }

        await db.query(`
            UPDATE attendance 
            SET clock_in = ?, clock_out = ?, duration_minutes = ?, overtime_reward = ?, late_penalty = ?, salary_earned = ? 
            WHERE id = ?
        `, [finalClockIn, finalClockOut, diffMins, finalOvertime, finalLate, salary, id]);

        res.json({ success: true, message: 'Shift berhasil diperbarui' });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Admin: Delete Attendance
router.delete('/attendance/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM attendance WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Shift berhasil dihapus' });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Admin: Toggle Payment Status
router.put('/attendance/:id/pay', async (req, res) => {
    try {
        const { id } = req.params;
        const { isPaid } = req.body;
        await db.query('UPDATE attendance SET is_paid = ? WHERE id = ?', [isPaid ? 1 : 0, id]);
        res.json({ success: true, message: 'Status pembayaran berhasil diperbarui' });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Admin: Sync all attendance salaries based on CURRENT user rates
router.post('/attendance/sync', async (req, res) => {
    try {
        // Get all users and their rates
        const [users] = await db.query('SELECT id, rate_per_minute FROM users');
        const rateMap = {};
        users.forEach(u => rateMap[u.id] = Number(u.rate_per_minute || 0));

        // Get all attendance records (BUT ignore PLANNED ones to avoid double counting or mess up)
        const [att] = await db.query(`
            SELECT id, user_id, duration_minutes, overtime_reward, late_penalty 
            FROM attendance 
            WHERE status != 'PLANNED'
        `);

        for (const a of att) {
            const currentRate = rateMap[a.user_id] || 0;
            const newSalary = (Number(a.duration_minutes || 0) * currentRate) + Number(a.overtime_reward || 0) - Number(a.late_penalty || 0);

            await db.query('UPDATE attendance SET salary_earned = ? WHERE id = ?', [newSalary, a.id]);
        }

        res.json({ success: true, message: 'Sinkronisasi gaji berhasil (kecuali data jadwal)' });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Auth: Check Current Shift Status (for auto-logout)
router.get('/shift-status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { attendance_id } = req.query;

        // 1. Get User Data
        const [users] = await db.query('SELECT id, username, role, allow_off_schedule FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

        const user = users[0];

        // 2. Owner/Admin: Always valid
        if (user.role === 'ADMIN' || user.role === 'OWNER') {
            return res.json({ success: true, valid: true, reason: 'ADMIN_OWNER' });
        }

        // 3. Active Shift Check (if attendance_id provided)
        if (attendance_id && attendance_id !== 'null') {
            const [att] = await db.query('SELECT * FROM attendance WHERE id = ? AND status = "ACTIVE"', [attendance_id]);
            if (att.length > 0) {
                const shift = att[0];
                const now = new Date();
                const shiftEnd = new Date(shift.clock_out);

                // Check if now > shiftEnd (with a 10 min grace period maybe?)
                // Let's stick to the exact end time
                if (now > shiftEnd) {
                    return res.json({ 
                        success: true, 
                        valid: false, 
                        reason: 'SHIFT_ENDED', 
                        message: 'Masa shift Anda telah berakhir. Silakan logout.' 
                    });
                }
                return res.json({ success: true, valid: true, reason: 'IN_SHIFT' });
            }
        }

        // 4. Off-Schedule Permission Check
        if (user.allow_off_schedule) {
            // Permission only allows browsing, and it's always "valid" if the permission is on.
            // But if the user wants auto-logout for *everyone* not in shift, then we check if there's *any* planned shift now.
            return res.json({ success: true, valid: true, reason: 'OFF_SCHEDULE_ALLOWED' });
        }

        // 5. No shift and no permission
        return res.json({ 
            success: true, 
            valid: false, 
            reason: 'NO_SHIFT_PERMISSION', 
            message: 'Anda tidak memiliki jadwal shift aktif saat ini.' 
        });

    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

module.exports = router;
