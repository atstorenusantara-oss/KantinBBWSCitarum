const salesService = require('../services/sales.service');

class SalesController {
    async create(req, res) {
        try {
            const result = await salesService.createTransaction(req.body);
            res.status(201).json({
                success: true,
                message: "Transaksi berhasil disimpan",
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Gagal memproses transaksi",
                error: error.message
            });
        }
    }

    async getPending(req, res) {
        try {
            const pending = await salesService.getPendingSales();
            res.json({ success: true, data: pending });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async complete(req, res) {
        try {
            const { id } = req.params;
            const { payment_method } = req.body;
            const result = await salesService.completePayment(id, payment_method);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new SalesController();
