const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class ProductService {
    // Get all products, optionally filtered by stand_id
    async getAll(standId = null) {
        if (standId) {
            const [rows] = await db.query(
                'SELECT * FROM products WHERE is_active = 1 AND stand_id = ? ORDER BY category, name',
                [standId]
            );
            return rows;
        }
        const [rows] = await db.query(
            'SELECT p.*, s.name as stand_name, s.code as stand_code FROM products p LEFT JOIN stands s ON p.stand_id = s.id WHERE p.is_active = 1 ORDER BY s.code, p.category, p.name'
        );
        return rows;
    }

    // Get distinct categories for a given stand
    async getCategoriesByStand(standId) {
        const [rows] = await db.query(
            'SELECT DISTINCT category FROM products WHERE is_active = 1 AND stand_id = ? ORDER BY category',
            [standId]
        );
        return rows.map(r => r.category);
    }

    async create(productData) {
        const { name, price, category, image_url, stand_id, is_active } = productData;
        const id = uuidv4();
        const activeStatus = is_active !== undefined ? is_active : 1;
        
        await db.query(
            'INSERT INTO products (id, name, price, category, image_url, stand_id, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, price, category, image_url, stand_id || null, activeStatus]
        );
        return { id, name, price, category, image_url, stand_id, is_active: activeStatus };
    }

    async update(id, productData) {
        const fields = [];
        const values = [];
        
        ['name', 'price', 'category', 'image_url', 'is_active', 'stand_id'].forEach(key => {
            if (productData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(productData[key]);
            }
        });

        if (fields.length === 0) return { id, ...productData };

        values.push(id);
        await db.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
        
        const [updated] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return updated[0];
    }

    async delete(id) {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        return { success: true, id };
    }
}

module.exports = new ProductService();
