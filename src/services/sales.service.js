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
                `INSERT INTO sales (id, invoice_number, total, payment_method, customer_name, payment_status, creator_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [salesId, invoice_number, total, payment_method, customer_name || 'Pelanggan', payment_status || 'PAID', salesData.creator_id || null]
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
                    GROUP_CONCAT(CONCAT(sub.name, ' (x', sub.sum_qty, ')') SEPARATOR ', ') as items_summary
             FROM sales s
             JOIN (
                 SELECT si.sales_id, p.name, SUM(si.qty) as sum_qty
                 FROM sales_items si
                 JOIN products p ON si.product_id = p.id
                 GROUP BY si.sales_id, p.id
             ) sub ON s.id = sub.sales_id
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

    async getSaleById(salesId) {
        const [sales] = await db.query(`
            SELECT s.*, u.username as staff_name 
            FROM sales s 
            LEFT JOIN users u ON s.creator_id = u.id 
            WHERE s.id = ?
        `, [salesId]);
        if (sales.length === 0) return null;

        const [items] = await db.query(
            `SELECT si.*, p.name 
             FROM sales_items si 
             JOIN products p ON si.product_id = p.id 
             WHERE si.sales_id = ?`,
            [salesId]
        );

        return {
            ...sales[0],
            items: items
        };
    }

    async addItemsToSale(salesId, newItems) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            let addedTotal = 0;
            for (const item of newItems) {
                const itemId = uuidv4();
                const productId = item.product_id || item.id; // Handle both key formats
                addedTotal += (item.qty * item.price);

                // Insert into sales_items
                await connection.query(
                    `INSERT INTO sales_items (id, sales_id, product_id, qty, price) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [itemId, salesId, productId, item.qty, item.price]
                );

                // Reduce stock
                await stockService.reduceStockFromSale(productId, item.qty, salesId, connection);
            }

            // Update total in sales table
            await connection.query(
                "UPDATE sales SET total = total + ? WHERE id = ?",
                [addedTotal, salesId]
            );

            await connection.commit();
            return { success: true };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new SalesService();
