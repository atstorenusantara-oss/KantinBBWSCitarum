const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedRecipes() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        // 1. Get products and materials
        const [products] = await db.query('SELECT id, name FROM products');
        const [materials] = await db.query('SELECT id, name FROM raw_materials');

        const getP = (name) => products.find(p => p.name.includes(name))?.id;
        const getM = (name) => materials.find(m => m.name.includes(name))?.id;

        // Clear existing recipes
        await db.query('DELETE FROM product_recipes');

        const recipes = [];
        const { v4: uuidv4 } = require('uuid');

        // Example: Kopi Susu / Latte needs Coffee Beans and Milk
        const latteId = getP('Latte') || getP('Kopi Susu');
        const beanId = getM('Biji Kopi');
        const milkId = getM('Susu Fresh');
        const cupId = getM('Cup');

        if (latteId) {
            if (beanId) recipes.push([uuidv4(), latteId, beanId, 18.00]); // 18g beans
            if (milkId) recipes.push([uuidv4(), latteId, milkId, 150.00]); // 150ml milk
            if (cupId) recipes.push([uuidv4(), latteId, cupId, 1.00]); // 1 cup
        }

        // Example: Espresso
        const espressoId = getP('Espresso');
        if (espressoId) {
            if (beanId) recipes.push([uuidv4(), espressoId, beanId, 18.00]);
        }

        if (recipes.length > 0) {
            await db.query('INSERT INTO product_recipes (id, product_id, material_id, quantity) VALUES ?', [recipes]);
            console.log(`Seeded ${recipes.length} recipe ingredients.`);
        } else {
            console.log('No matching products/materials found to seed recipes.');
        }

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await db.end();
    }
}

seedRecipes();
