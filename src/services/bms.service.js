const db = require('../database/connection');

class BMSService {
    /**
     * Get all BMS devices and their current status
     */
    async getAllDevices() {
        const [rows] = await db.query('SELECT * FROM bms_devices WHERE is_active = TRUE ORDER BY category ASC');
        return rows;
    }

    /**
     * Update device value (for actuators like lights/AC)
     * @param {string} id - Device ID
     * @param {string} value - New value (e.g. 'ON', 'OFF')
     */
    async updateDeviceStatus(id, value) {
        // Update device current value
        await db.query('UPDATE bms_devices SET current_value = ? WHERE id = ?', [value, id]);

        // Log the change
        await db.query('INSERT INTO bms_logs (device_id, value) VALUES (?, ?)', [id, value]);

        return { success: true, id, newValue: value };
    }

    /**
     * Get recent logs for a specific device
     */
    async getDeviceLogs(deviceId, limit = 10) {
        const [rows] = await db.query(
            'SELECT * FROM bms_logs WHERE device_id = ? ORDER BY created_at DESC LIMIT ?',
            [deviceId, limit]
        );
        return rows;
    }
}

module.exports = new BMSService();
