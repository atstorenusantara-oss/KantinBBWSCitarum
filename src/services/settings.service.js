const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class SettingsService {
    async getSettings() {
        const [rows] = await db.query('SELECT * FROM settings');
        const settings = {};
        rows.forEach(row => {
            settings[row.key_name] = row.value;
        });
        return settings;
    }

    async updateSetting(key, value) {
        await db.query(
            'INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
            [key, value, value]
        );
        return { success: true };
    }

    async getActivityLogs() {
        const [rows] = await db.query(`
            SELECT al.*, u.username 
            FROM activity_logs al 
            JOIN users u ON al.user_id = u.id 
            ORDER BY al.created_at DESC 
            LIMIT 100
        `);
        return rows;
    }

    async logActivity(userId, action, note = '') {
        const id = uuidv4();
        await db.query(
            'INSERT INTO activity_logs (id, user_id, action, note) VALUES (?, ?, ?, ?)',
            [id, userId, action, note]
        );
        return { success: true };
    }
}

module.exports = new SettingsService();
