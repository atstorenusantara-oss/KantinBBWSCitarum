const qrisService = require('../services/qris.service');
const salesService = require('../services/sales.service');
const db = require('../database/connection');

class QrisController {
    /**
     * Handle Webhook from TemanQRIS
     * POST /api/qris/webhook
     */
    async handleWebhook(req, res) {
        const signature = req.headers['x-temanqris-signature'];
        const payload = req.body;

        // 1. Verify Signature
        const isValid = qrisService.verifyWebhookSignature(payload, signature);
        if (!isValid) {
            console.error("⚠️ Invalid Webhook Signature received from TemanQRIS");
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const { event, data } = payload;
        const invoiceNumber = data.order_id;

        console.log(`[TemanQRIS Webhook] Event: ${event} for Invoice: ${invoiceNumber}`);

        try {
            // 2. Process Events
            if (event === 'payment.awaiting_confirmation') {
                // Customer clicked "Sudah Bayar"
                // Mark in your own database that human verification is needed
                await db.query(
                    "UPDATE sales SET payment_status = 'AWAITING_VERIFICATION' WHERE invoice_number = ? AND payment_status = 'PENDING'",
                    [invoiceNumber]
                );
                
                // NOTE: Here you could trigger a WebSocket broadcast to the Dashboard
                // Notify POS UI: "Customer claims payment for #INV..."
            }

            if (event === 'payment.confirmed') {
                // Payment was confirmed (maybe via TemanQRIS dashboard or internal logic)
                await db.query(
                    "UPDATE sales SET payment_status = 'PAID' WHERE invoice_number = ? AND payment_status != 'PAID'",
                    [invoiceNumber]
                );
            }

            res.json({ received: true });
        } catch (error) {
            console.error("Webhook Processing Error:", error.message);
            res.status(500).json({ error: "Internal server error during webhook processing" });
        }
    }

    /**
     * Check Status from POS Dashboard (Automatic Check)
     * GET /api/qris/check/:invoiceNumber
     */
    async checkStatus(req, res) {
        const { invoiceNumber } = req.params;

        try {
            const result = await qrisService.checkStatus(invoiceNumber);
            console.log(`[Check Status] Result for ${invoiceNumber}:`, JSON.stringify(result));
            
            if (result.success) {
                const status = (result.data?.status || result.status || '').toUpperCase();
                
                if (status === 'PAID') {
                    await db.query(
                        "UPDATE sales SET payment_status = 'PAID' WHERE invoice_number = ?",
                        [invoiceNumber]
                    );
                    return res.json({ success: true, message: "Pembayaran telah terdeteksi!" });
                } else {
                    let msg = "Belum ada pembayaran terdeteksi.";
                    if (status === 'AWAITING_CONFIRMATION' || status === 'PENDING') {
                        msg = "Pembayaran sedang dalam proses. Harap tunggu sebentar.";
                    } else if (status === 'EXPIRED') {
                        msg = "QR Code sudah kedaluwarsa. Silakan batalkan dan buat baru.";
                    }
                    
                    return res.json({ 
                        success: false, 
                        message: msg,
                        current_status: status
                    });
                }
            } else {
                return res.status(400).json({ success: false, message: result.message || "Invoice tidak ditemukan di TemanQRIS." });
            }
        } catch (error) {
            console.error("Check Status catch:", error.message);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    /**
     * Force Verify from POS Dashboard (Manual override)
     * POST /api/qris/verify/:invoiceNumber
     */
    async manualVerify(req, res) {
        const { invoiceNumber } = req.params;
        const { payer_name, payer_note } = req.body;

        try {
            // WARNING: This is a manual override (Force PAID)
            const result = await qrisService.verify(invoiceNumber, payer_name, payer_note);
            
            if (result.success) {
                await db.query(
                    "UPDATE sales SET payment_status = 'PAID' WHERE invoice_number = ?",
                    [invoiceNumber]
                );
                return res.json({ success: true, message: "Pembayaran BERHASIL DIKONFIRMASI MANUAL (FORCE PAID)" });
            } else {
                return res.status(400).json({ success: false, message: result.message });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new QrisController();
