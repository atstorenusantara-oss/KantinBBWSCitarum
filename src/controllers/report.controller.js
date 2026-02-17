const reportService = require('../services/report.service');
const salesService = require('../services/sales.service');

class ReportController {
    async getDaily(req, res) {
        try {
            const { date, shift } = req.query; // YYYY-MM-DD, shift: 1 or 2
            const report = await reportService.getDailyReport(
                date || new Date().toISOString().split('T')[0],
                shift || 1
            );
            res.json({ success: true, data: report });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getWeekly(req, res) {
        try {
            const report = await reportService.getWeeklyReport();
            res.json({ success: true, data: report });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getMonthly(req, res) {
        try {
            const report = await reportService.getMonthlyReport();
            res.json({ success: true, data: report });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getInventory(req, res) {
        try {
            const inventory = await reportService.getInventoryStatus();
            res.json({ success: true, data: inventory });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getSaleDetail(req, res) {
        try {
            const { id } = req.params;
            const sale = await salesService.getSaleById(id);
            if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });
            res.json({ success: true, data: sale });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new ReportController();
