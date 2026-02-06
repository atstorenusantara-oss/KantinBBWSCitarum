const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class MaterialService {
    async getAll() {
        const [rows] = await db.query('SELECT * FROM raw_materials');
        return rows;
    }

    async create(materialData) {
        const { name, unit, min_stock } = materialData;
        const id = uuidv4();
        await db.query(
            'INSERT INTO raw_materials (id, name, unit, min_stock, stock) VALUES (?, ?, ?, ?, 0)',
            [id, name, unit, min_stock]
        );
        return { id, name, unit, min_stock };
    }

    async adjustStock(id, qty, type, note, reference_id = null) {
        const connection = await db.getConnection();
        const movementId = uuidv4();

        try {
            await connection.beginTransaction();

            // 1. Update stock
            let operator = type === 'IN' ? '+' : '-';
            if (type === 'ADJUST') {
                await connection.query('UPDATE raw_materials SET stock = ? WHERE id = ?', [qty, id]);
            } else {
                await connection.query(`UPDATE raw_materials SET stock = stock ${operator} ? WHERE id = ?`, [qty, id]);
            }

            // 2. Record movement
            await connection.query(
                `INSERT INTO stock_movements (id, raw_material_id, type, qty, note, reference_id) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [movementId, id, type, qty, note, reference_id]
            );

            await connection.commit();
            return { success: true, movementId };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new MaterialService();
