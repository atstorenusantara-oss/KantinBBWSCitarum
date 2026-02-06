const bmsService = require('../services/bms.service');

class BMSController {
    async getDevices(req, res) {
        try {
            const devices = await bmsService.getAllDevices();
            res.json({ success: true, data: devices });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async toggleDevice(req, res) {
        try {
            const { id } = req.params;
            const { value } = req.body;
            const result = await bmsService.updateDeviceStatus(id, value);
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async postTelemetry(req, res) {
        try {
            const { device_name, value } = req.body;

            if (!device_name || value === undefined) {
                return res.status(400).json({ success: false, error: "Missing device_name or value" });
            }

            const result = await bmsService.saveTelemetry(device_name, value.toString());
            res.json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getStatusByName(req, res) {
        try {
            const { name } = req.query;
            if (!name) return res.status(400).json({ success: false, error: "Missing name query param" });

            const status = await bmsService.getDeviceStatusByName(name);
            if (status === null) return res.status(404).json({ success: false, error: "Device not found" });

            res.json({ success: true, name, status });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new BMSController();
