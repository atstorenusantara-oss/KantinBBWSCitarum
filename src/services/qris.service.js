const crypto = require('crypto');

class QrisService {
    constructor() {
        this.apiKey = process.env.TEMANQRIS_API_KEY;
        this.base_url = process.env.TEMANQRIS_BASE_URL || 'https://temanqris.com/api/qris';
        this.webhookSecret = process.env.TEMANQRIS_WEBHOOK_SECRET;
    }

    /**
     * Generate Dynamic QRIS
     * @param {number} amount 
     * @param {string} orderId 
     * @param {string} webhookUrl Optional override
     * @returns {Promise<object>} { success, qris, qr_image, payment_link }
     */
    async generate(amount, orderId, webhookUrl = null) {
        try {
            const body = {
                amount: amount,
                order_id: orderId
            };

            if (webhookUrl) body.webhook_url = webhookUrl;

            const response = await fetch(`${this.base_url}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey
                },
                body: JSON.stringify(body)
            });

            return await response.json();
        } catch (error) {
            console.error("TemanQRIS Generate Error:", error.message);
            throw new Error("Gagal membuat QRIS Dinamis");
        }
    }

    /**
     * Check Order Status
     * @param {string} orderId 
     */
    async checkStatus(orderId) {
        try {
            const response = await fetch(`${this.base_url}/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'X-API-Key': this.apiKey
                }
            });

            return await response.json();
        } catch (error) {
            console.error("TemanQRIS Status Check Error:", error.message);
            throw new Error("Gagal mengecek status pembayaran");
        }
    }

    /**
     * Mark Order as Paid (Direct Verify)
     * @param {string} orderId 
     * @param {string} payerName Optional
     * @param {string} payerNote Optional
     */
    async verify(orderId, payerName = '', payerNote = '') {
        try {
            const body = {
                payer_name: payerName,
                payer_note: payerNote
            };

            const response = await fetch(`${this.base_url}/orders/${orderId}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey
                },
                body: JSON.stringify(body)
            });

            return await response.json();
        } catch (error) {
            console.error("TemanQRIS Verify Error:", error.message);
            throw new Error("Gagal melakukan verifikasi pembayaran");
        }
    }

    /**
     * Helper to verify webhook signature
     */
    verifyWebhookSignature(payload, signature) {
        if (!this.webhookSecret) {
            console.warn("⚠️ TEMANQRIS_WEBHOOK_SECRET is not set. Signature verification skipped.");
            return true; 
        }

        const expected = 'sha256=' + crypto
            .createHmac('sha256', this.webhookSecret)
            .update(JSON.stringify(payload))
            .digest('hex');

        try {
            return crypto.timingSafeEqual(
                Buffer.from(signature),
                Buffer.from(expected)
            );
        } catch (e) {
            return false;
        }
    }
}

module.exports = new QrisService();
