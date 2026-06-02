const salesService = require('../services/sales.service');
const printerService = require('../services/printer.service');
const qrisService = require('../services/qris.service');
const settingsService = require('../services/settings.service');

class SalesController {
    async create(req, res) {
        try {
            const { should_print, ...salesData } = req.body;
            const { total, invoice_number, payment_method } = salesData;
            
            const result = await salesService.createTransaction(salesData);

            // Log activity
            await settingsService.logActivity(salesData.creator_id, 'CREATE_SALE', `Created ${salesData.payment_status} sale: ${salesData.invoice_number}`);

            // Fitur QRIS Dinamis dinonaktifkan (menjadi catatan saja)
            let qrisData = null;

            let printResult = null;
            if (should_print) {
                try {
                    printResult = await printerService.printReceipt(req.body);
                } catch (pError) {
                    console.error("Print feature failed:", pError);
                    printResult = { success: false, error: "Gagal mencetak struk" };
                }
            }

            res.status(201).json({
                success: true,
                message: "Transaksi berhasil disimpan",
                data: result,
                qris: qrisData,
                print: printResult
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
            
            // Get sale before completing to get total and invoice_number
            const saleData = await salesService.getSaleById(id);
            if (!saleData) {
                return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
            }

            // Fitur QRIS Dinamis dinonaktifkan (menjadi catatan saja)
            // Lanjut proses sebagai pembayaran normal (CASH/QRIS Catatan)

            // Otherwise process as normal (CASH etc)
            const result = await salesService.completePayment(id, payment_method);

            // Log activity
            await settingsService.logActivity(null, 'COMPLETE_SALE', `Completed payment for sale: ${id} with ${payment_method}`);

            const printResult = await printerService.printReceipt(saleData);

            res.json({ success: true, data: result, print: printResult });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async reprint(req, res) {
        try {
            const { id } = req.params;
            const salesData = await salesService.getSaleById(id);
            if (!salesData) {
                return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
            }

            const printResult = await printerService.printReceipt(salesData);

            // Log activity
            await settingsService.logActivity(null, 'REPRINT_SALE', `Reprinted receipt for ${salesData.invoice_number}`);
            res.json({ success: true, message: "Perintah cetak ulang dikirim", print: printResult });
        } catch (error) {
            console.error("Reprint Error:", error);
            res.status(500).json({ success: false, message: error.message, error: error.stack });
        }
    }
    async updateItems(req, res) {
        try {
            const { id } = req.params;
            const { items } = req.body;
            const result = await salesService.addItemsToSale(id, items);
            res.json({ success: true, message: "Menu berhasil ditambahkan ke bill", data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: "Gagal menambah menu", error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const saleData = await salesService.getSaleById(id);
            if (!saleData) {
                return res.status(404).json({ success: false, message: "Transaksi tidak ditemukan" });
            }

            await salesService.deleteSale(id);

            // Log activity
            await settingsService.logActivity(null, 'DELETE_SALE', `Deleted sale: ${saleData.invoice_number} (Customer: ${saleData.customer_name})`);

            res.json({ success: true, message: "Transaksi berhasil dihapus" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Gagal menghapus transaksi", error: error.message });
        }
    }
}

module.exports = new SalesController();
