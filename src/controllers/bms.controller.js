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
}

module.exports = new BMSController();
