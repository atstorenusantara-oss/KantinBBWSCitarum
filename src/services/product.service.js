const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class ProductService {
    async getAll() {
        const [rows] = await db.query('SELECT * FROM products WHERE is_active = true');
        return rows;
    }

    async create(productData) {
        const { name, price, category, image_url } = productData;
        const id = uuidv4();
        await db.query(
            'INSERT INTO products (id, name, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
            [id, name, price, category, image_url]
        );
        return { id, name, price, category, image_url };
    }

    async update(id, productData) {
        const { name, price, category, image_url, is_active } = productData;
        await db.query(
            'UPDATE products SET name = ?, price = ?, category = ?, image_url = ?, is_active = ? WHERE id = ?',
            [name, price, category, image_url, is_active, id]
        );
        return { id, name, price, category, image_url, is_active };
    }
}

module.exports = new ProductService();
