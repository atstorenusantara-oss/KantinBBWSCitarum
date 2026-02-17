const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs');

class StockService {
    /**
     * Reduce stock based on products sold
     * @param {string} productId 
     * @param {number} qtySold 
     * @param {string} salesId 
     * @param {object} connection - Optional mysql2 connection for transaction
     */
    async reduceStockFromSale(productId, qtySold, salesId, connection = null) {
        const executor = connection || db;

        // 1. Get recipe details for the product
        const [recipeDetails] = await executor.query(
            `SELECT rd.raw_material_id, rd.qty 
             FROM recipe_details rd
             JOIN recipes r ON rd.recipe_id = r.id
             WHERE r.product_id = ?`,
            [productId]
        );

        for (const item of recipeDetails) {
            const totalUsed = item.qty * qtySold;

            // 2. Update raw material stock
            await executor.query(
                `UPDATE raw_materials 
                 SET stock = stock - ? 
                 WHERE id = ?`,
                [totalUsed, item.raw_material_id]
            );

            // 3. Record stock movement
            await executor.query(
                `INSERT INTO stock_movements (id, raw_material_id, type, qty, reference_id, note)
                 VALUES (?, ?, 'OUT', ?, ?, ?)`,
                [uuidv4(), item.raw_material_id, totalUsed, salesId, `Sale of product ${productId}`]
            );
        }
    }

    /**
     * Process Stock Opname (Point 6.2 in file_analisa.md)
     * @param {string} rawMaterialId 
     * @param {number} physicalStock 
     * @param {string} note 
     */
    async processStockOpname(rawMaterialId, physicalStock, note = '') {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Get current system stock
            const [materials] = await connection.query(
                'SELECT stock, name FROM raw_materials WHERE id = ? FOR UPDATE',
                [rawMaterialId]
            );

            if (materials.length === 0) {
                throw new Error('Raw material not found');
            }

            const systemStock = parseFloat(materials[0].stock);
            const difference = physicalStock - systemStock;
            const opnameId = uuidv4();

            // Auto-tag anomaly: 3 units for cups, 50 units for others
            let finalNote = note;
            const absDiff = Math.abs(difference);
            const materialName = materials[0].name.toLowerCase();
            const threshold = materialName.includes('cup') ? 2 : 50;

            if (absDiff > threshold) {
                finalNote = `[ANOMALY ${absDiff.toFixed(1)}] ${note}`;
            }

            // 2. Save Opname Record
            await connection.query(
                `INSERT INTO stock_opnames (id, raw_material_id, system_stock, physical_stock, difference, note)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [opnameId, rawMaterialId, systemStock, physicalStock, difference, finalNote]
            );

            // 3. Update Raw Material Stock to physical stock
            await connection.query(
                'UPDATE raw_materials SET stock = ? WHERE id = ?',
                [physicalStock, rawMaterialId]
            );

            // 4. Record Stock Movement (ADJUST)
            if (difference !== 0) {
                await connection.query(
                    `INSERT INTO stock_movements (id, raw_material_id, type, qty, reference_id, note)
                     VALUES (?, ?, 'ADJUST', ?, ?, ?)`,
                    [uuidv4(), rawMaterialId, Math.abs(difference), opnameId, `Opname Adjustment: ${note}`]
                );
            }

            await connection.commit();
            return {
                id: opnameId,
                raw_material_id: rawMaterialId,
                system_stock: systemStock,
                physical_stock: physicalStock,
                difference: difference
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Get opname history with filters
     * @param {string} filter - 'daily', 'weekly', 'monthly'
     * @param {string} date - base date YYYY-MM-DD
     */
    async getOpnameHistory(filter = 'daily', date = null) {
        let query = `
            SELECT so.*, rm.name as material_name, rm.unit 
            FROM stock_opnames so
            JOIN raw_materials rm ON so.raw_material_id = rm.id
            WHERE 1=1
        `;
        const params = [];
        let baseDate = date ? dayjs(date) : dayjs();

        // Handle "Early Morning" shift (12 AM - 3 AM)
        // If it's early morning and no specific date was requested, 
        // we are technically still in "yesterday's" business shift.
        if (!date && dayjs().hour() < 6) {
            baseDate = baseDate.subtract(1, 'day');
        }

        if (filter === 'daily' || !filter) {
            const startTime = baseDate.hour(6).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
            const endTime = baseDate.add(1, 'day').hour(3).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
            query += ' AND so.created_at BETWEEN ? AND ?';
            params.push(startTime, endTime);
        } else if (filter === 'weekly') {
            query += ' AND so.created_at >= ?';
            params.push(baseDate.subtract(7, 'day').hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'));
        } else if (filter === 'monthly') {
            query += ' AND MONTH(so.created_at) = ? AND YEAR(so.created_at) = ?';
            params.push(baseDate.month() + 1);
            params.push(baseDate.year());
        }

        query += ' ORDER BY so.created_at DESC';

        const [rows] = await db.query(query, params);
        return rows;
    }

    /**
     * Restock raw material (Stock IN)
     */
    async restock(rawMaterialId, qty, note = '') {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(
                'UPDATE raw_materials SET stock = stock + ? WHERE id = ?',
                [qty, rawMaterialId]
            );

            await connection.query(
                `INSERT INTO stock_movements (id, raw_material_id, type, qty, note)
                 VALUES (?, ?, 'IN', ?, ?)`,
                [uuidv4(), rawMaterialId, qty, note || 'Restock/Stock In']
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
    async resolveAnomaly(opnameId, pin) {
        const [users] = await db.query('SELECT username FROM users WHERE role = "ADMIN" AND pin = ?', [pin]);
        if (users.length === 0) {
            throw new Error('PIN Admin tidak valid atau Anda bukan Owner/Admin!');
        }

        const username = users[0].username;
        await db.query(
            'UPDATE stock_opnames SET is_resolved = 1, resolved_by = ? WHERE id = ?',
            [username, opnameId]
        );

        return { success: true, resolved_by: username };
    }
}

module.exports = new StockService();
