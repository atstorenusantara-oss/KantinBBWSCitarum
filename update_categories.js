const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function update() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        // Update existing ones
        await db.query("UPDATE products SET category = 'Espresso Based' WHERE name = 'Espresso' OR name = 'Americano'");
        await db.query("UPDATE products SET category = 'Milk Based' WHERE name = 'Cappuccino' OR name = 'Latte'");

        // Insert snacks if not exists
        const snacks = [
            { name: 'French Fries', price: 15000, category: 'Snack' },
            { name: 'Croissant', price: 20000, category: 'Snack' }
        ];

        for (const s of snacks) {
            const [rows] = await db.query('SELECT id FROM products WHERE name = ?', [s.name]);
            if (rows.length === 0) {
                await db.query(
                    'INSERT INTO products (id, name, price, category) VALUES (?, ?, ?, ?)',
                    [uuidv4(), s.name, s.price, s.category]
                );
                console.log(`Added snack: ${s.name}`);
            } else {
                await db.query('UPDATE products SET category = ? WHERE name = ?', [s.category, s.name]);
                console.log(`Updated snack category: ${s.name}`);
            }
        }

        console.log('Update finished!');
    } catch (e) {
        console.error(e);
    } finally {
        await db.end();
    }
}

update();
