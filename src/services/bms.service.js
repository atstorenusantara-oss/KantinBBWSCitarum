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

        // Log the change (Disabled by request)
        // await db.query('INSERT INTO bms_logs (device_id, value) VALUES (?, ?)', [id, value]);

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

    /**
     * Save telemetry data from ESP32
     * @param {string} deviceName - Human readable name or ID from ESP32
     * @param {string} value - The sensor value
     */
    async saveTelemetry(deviceName, value) {
        // 1. Find the device by name (or we can use ID)
        const [devices] = await db.query('SELECT id FROM bms_devices WHERE name = ?', [deviceName]);

        if (devices.length === 0) {
            throw new Error(`Device with name ${deviceName} not found`);
        }

        const deviceId = devices[0].id;

        // 2. Update current value
        await db.query('UPDATE bms_devices SET current_value = ?, last_update = CURRENT_TIMESTAMP WHERE id = ?', [value, deviceId]);

        // 3. Log the value (Disabled by request)
        // await db.query('INSERT INTO bms_logs (device_id, value) VALUES (?, ?)', [deviceId, value]);

        return { success: true, deviceId, updatedValue: value };
    }

    /**
     * Get single device status (for ESP32 polling)
     * @param {string} name - Device name (e.g., 'Lampu Area Indoor')
     */
    async getDeviceStatusByName(name) {
        const [rows] = await db.query('SELECT current_value FROM bms_devices WHERE name = ?', [name]);
        if (rows.length === 0) return null;
        return rows[0].current_value;
    }
}

module.exports = new BMSService();
