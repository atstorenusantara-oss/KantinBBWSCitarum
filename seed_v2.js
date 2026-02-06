const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function seed() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        // Clear old products to avoid mess
        await db.query('DELETE FROM recipe_details');
        await db.query('DELETE FROM recipes');
        await db.query('DELETE FROM products');

        const products = [
            { name: 'Espresso', price: 15000, category: 'Espresso Based' },
            { name: 'Cappuccino', price: 25000, category: 'Milk Based' },
            { name: 'Latte', price: 22000, category: 'Milk Based' },
            { name: 'V60 Gayo', price: 25000, category: 'Manual Brew' },
            { name: 'French Fries', price: 15000, category: 'Snack' },
            { name: 'Croissant', price: 20000, category: 'Snack' }
        ];

        for (const p of products) {
            await db.query(
                'INSERT INTO products (id, name, price, category) VALUES (?, ?, ?, ?)',
                [uuidv4(), p.name, p.price, p.category]
            );
            console.log(`Seeded: ${p.name} (${p.category})`);
        }

        console.log('Seeding finished!');
    } catch (e) {
        console.error(e);
    } finally {
        await db.end();
    }
}

seed();
