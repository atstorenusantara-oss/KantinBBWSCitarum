const mysql = require('mysql2/promise');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

async function seedRecipes() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        console.log('Fetching products and materials...');
        const [products] = await db.query('SELECT id, name FROM products');
        const [materials] = await db.query('SELECT id, name FROM raw_materials');

        const getP = (name) => products.find(p => p.name.toLowerCase() === name.toLowerCase())?.id;
        const getP_like = (name) => products.find(p => p.name.toLowerCase().includes(name.toLowerCase()))?.id;
        const getM = (name) => materials.find(m => m.name.toLowerCase().includes(name.toLowerCase()))?.id;

        // Clear existing recipes in product_recipes (AI Table)
        await db.query('DELETE FROM product_recipes');

        const recipes = [];

        // Definition of standard materials
        const beanId = getM('Biji Kopi');
        const uhtId = getM('Susu UHT');
        const skmId = getM('Susu Kental Manis');
        const creamerId = getM('Creamer Bubuk');
        const cupPlastikId = getM('Cup Plastik');
        const cupKertasId = getM('Cup Kertas');

        // Logic to add recipe items
        const addRecipe = (productId, materialId, qty) => {
            if (productId && materialId) {
                recipes.push([uuidv4(), productId, materialId, qty]);
            }
        };

        // 1. Hazelnut Latte (The missing one)
        const hazelnutProducts = products.filter(p => p.name.includes('Hazelnut Latte'));
        const hazelnutSyrupId = getM('Sirup Hazelnut');

        for (const p of hazelnutProducts) {
            addRecipe(p.id, beanId, 15);
            addRecipe(p.id, uhtId, 100);
            addRecipe(p.id, skmId, 25);
            addRecipe(p.id, creamerId, 12);
            addRecipe(p.id, hazelnutSyrupId, 20);
            addRecipe(p.id, p.name.includes('(Panas)') ? cupKertasId : cupPlastikId, 1);
        }

        // 2. Caramel Latte
        const caramelProducts = products.filter(p => p.name.includes('Caramel Latte'));
        const caramelSyrupId = getM('Syrup Caramel');
        for (const p of caramelProducts) {
            addRecipe(p.id, beanId, 15);
            addRecipe(p.id, uhtId, 100);
            addRecipe(p.id, skmId, 25);
            addRecipe(p.id, creamerId, 12);
            addRecipe(p.id, caramelSyrupId, 20);
            addRecipe(p.id, p.name.includes('(Panas)') ? cupKertasId : cupPlastikId, 1);
        }

        // 3. Vanilla Latte
        const vanillaProducts = products.filter(p => p.name.includes('Vanilla Latte'));
        const vanillaSyrupId = getM('Vanilla Powder'); // Note: material name is Vanilla Powder
        for (const p of vanillaProducts) {
            addRecipe(p.id, beanId, 15);
            addRecipe(p.id, uhtId, 100);
            addRecipe(p.id, skmId, 25);
            addRecipe(p.id, creamerId, 12);
            addRecipe(p.id, vanillaSyrupId, 20);
            addRecipe(p.id, p.name.includes('(Panas)') ? cupKertasId : cupPlastikId, 1);
        }

        // 4. Espresso
        const espressoProducts = products.filter(p => p.name.includes('Espresso'));
        for (const p of espressoProducts) {
            addRecipe(p.id, beanId, 18);
        }

        // 5. Kopi Susu
        const kopiSusuProducts = products.filter(p => p.name.includes('Kopi Susu'));
        const gulaArenId = getM('Gula Aren Cair');
        for (const p of kopiSusuProducts) {
            addRecipe(p.id, beanId, 15);
            addRecipe(p.id, uhtId, 100);
            addRecipe(p.id, skmId, 25);
            addRecipe(p.id, creamerId, 12);
            addRecipe(p.id, gulaArenId, 20);
            addRecipe(p.id, p.name.includes('(Panas)') ? cupKertasId : cupPlastikId, 1);
        }

        if (recipes.length > 0) {
            await db.query('INSERT INTO product_recipes (id, product_id, material_id, quantity) VALUES ?', [recipes]);
            console.log(`✅ Successfully seeded ${recipes.length} recipe ingredients for AI analysis.`);
        } else {
            console.log('⚠️ No matching products/materials found to seed recipes.');
        }

    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        await db.end();
    }
}

seedRecipes();
