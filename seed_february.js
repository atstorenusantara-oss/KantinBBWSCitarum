const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function seed() {
    console.log('Starting updated seeding process with Hot/Cold variants...');
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('DELETE FROM recipe_details');
        await db.query('DELETE FROM recipes');
        await db.query('DELETE FROM products');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        const baseProducts = [
            { name: 'Roti Bakar Keju', price: 13000, category: 'Snack', image: '/assets/img/roti-bakar.jpg', hasVariant: false },
            { name: 'Espresso', price: 15000, category: 'Espresso Based', image: '/assets/img/espresso.jpg', hasVariant: true },
            { name: 'Coklat', price: 18000, category: 'Non-Coffee', image: '/assets/img/coklat.jpg', hasVariant: true },
            { name: 'Americano', price: 18000, category: 'Espresso Based', image: '/assets/img/americano.jpg', hasVariant: true },
            { name: 'Lemon Tea', price: 22000, category: 'Non-Coffee', image: '/assets/img/lemon-tea.jpg', hasVariant: true },
            { name: 'Matcha', price: 22000, category: 'Non-Coffee', image: '/assets/img/matcha.jpg', hasVariant: true },
            { name: 'Latte', price: 25000, category: 'Milk Based', image: '/assets/img/latte.jpg', hasVariant: true },
            { name: 'Thai Tea', price: 18000, category: 'Non-Coffee', image: '/assets/img/thai-tea.jpg', hasVariant: true },
            { name: 'StrawBerry Squash', price: 22000, category: 'Non-Coffee', image: '/assets/img/strawberry-squash.jpg', hasVariant: true },
            { name: 'Kopi Gula Aren', price: 20000, category: 'Milk Based', image: '/assets/img/kopi-aren.jpg', hasVariant: true },
            { name: 'Butterscotch', price: 25000, category: 'Milk Based', image: '/assets/img/butterscotch.jpg', hasVariant: true },
            { name: 'Kopi Susu', price: 18000, category: 'Milk Based', image: '/assets/img/kopi-susu.jpg', hasVariant: true },
            { name: 'Pandan Latte', price: 28000, category: 'Milk Based', image: '/assets/img/pandan-latte.jpg', hasVariant: true },
            { name: 'Vanilla Latte', price: 28000, category: 'Milk Based', image: '/assets/img/vanilla-latte.jpg', hasVariant: true },
            { name: 'Caramel Latte', price: 29000, category: 'Milk Based', image: '/assets/img/caramel-latte.jpg', hasVariant: true },
            { name: 'Hazelnut Latte', price: 29000, category: 'Milk Based', image: '/assets/img/hazelnut-latte.jpg', hasVariant: true },
            { name: 'Matcha Latte', price: 22000, category: 'Non-Coffee', image: '/assets/img/matcha-latte.jpg', hasVariant: true },
            { name: 'Red Velvet Creamy', price: 25000, category: 'Non-Coffee', image: '/assets/img/red-velvet.jpg', hasVariant: true }
        ];

        for (const p of baseProducts) {
            // Seed Base Product
            const baseId = uuidv4();
            await db.query(
                'INSERT INTO products (id, name, price, category, image_url, is_active) VALUES (?, ?, ?, ?, ?, 1)',
                [baseId, p.name, p.price, p.category, p.image]
            );

            if (p.hasVariant) {
                // Seed Hot Variant
                await db.query(
                    'INSERT INTO products (id, name, price, category, image_url, is_active) VALUES (?, ?, ?, ?, ?, 1)',
                    [uuidv4(), `${p.name} (Panas)`, p.price, p.category, p.image]
                );
                // Seed Cold Variant
                await db.query(
                    'INSERT INTO products (id, name, price, category, image_url, is_active) VALUES (?, ?, ?, ?, ?, 1)',
                    [uuidv4(), `${p.name} (Dingin)`, p.price, p.category, p.image]
                );
                console.log(`Seeded: ${p.name} with Hot/Cold variants`);
            } else {
                console.log(`Seeded: ${p.name} (No variants)`);
            }
        }

        console.log('==========================================');
        console.log('HOT/COLD VARIANTS SEEDED SUCCESSFULLY!');
        console.log('==========================================');

    } catch (e) {
        console.error('ERROR SEEDING:', e);
    } finally {
        await db.end();
    }
}

seed();
