const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');
const stockService = require('./stock.service');

class SalesService {
    async createTransaction(salesData) {
        const { invoice_number, items, total, payment_method, customer_name, payment_status } = salesData;
        const salesId = uuidv4();

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Insert into sales table
            await connection.query(
                `INSERT INTO sales (id, invoice_number, total, payment_method, customer_name, payment_status) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [salesId, invoice_number, total, payment_method, customer_name || 'Pelanggan', payment_status || 'PAID']
            );

            // 2. Insert items and reduce stock
            for (const item of items) {
                const itemId = uuidv4();

                // Insert sales item
                await connection.query(
                    `INSERT INTO sales_items (id, sales_id, product_id, qty, price) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [itemId, salesId, item.product_id, item.qty, item.price]
                );

                // REDUCE STOCK logic (Integrated)
                await stockService.reduceStockFromSale(item.product_id, item.qty, salesId, connection);
            }

            await connection.commit();
            return { success: true, salesId };

        } catch (error) {
            await connection.rollback();
            console.error('Transaction Error:', error);
            throw error;

        } finally {
            connection.release();
        }
    }

    async getPendingSales() {
        const [rows] = await db.query(
            `SELECT s.id, s.invoice_number, s.customer_name, s.total, s.payment_method, s.created_at,
                    GROUP_CONCAT(CONCAT(p.name, ' (x', si.qty, ')') SEPARATOR ', ') as items_summary
             FROM sales s
             JOIN sales_items si ON s.id = si.sales_id
             JOIN products p ON si.product_id = p.id
             WHERE s.payment_status = 'PENDING' 
             GROUP BY s.id
             ORDER BY s.created_at DESC`
        );
        return rows;
    }

    async completePayment(salesId, paymentMethod) {
        await db.query(
            "UPDATE sales SET payment_status = 'PAID', payment_method = ? WHERE id = ?",
            [paymentMethod, salesId]
        );
        return { success: true };
    }
}

module.exports = new SalesService();
