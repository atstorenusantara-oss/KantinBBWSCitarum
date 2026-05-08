const mysql = require('mysql2/promise');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

async function updateHazelnutRecipe() {
    console.log('UPDATING MAIN RECIPE FOR HAZELNUT LATTE...');
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        // 1. Get IDs
        const [syrupRows] = await db.query("SELECT id FROM raw_materials WHERE name = 'Sirup Hazelnut'");
        if (syrupRows.length === 0) throw new Error('Sirup Hazelnut not found!');
        const syrupId = syrupRows[0].id;

        const [products] = await db.query("SELECT id, name FROM products WHERE name LIKE '%Hazelnut Latte%'");
        if (products.length === 0) throw new Error('Hazelnut Latte products not found!');

        for (const p of products) {
            console.log(`Checking recipe for: ${p.name}`);

            // Get or create recipe id
            let [recipes] = await db.query("SELECT id FROM recipes WHERE product_id = ?", [p.id]);
            let recipeId;

            if (recipes.length === 0) {
                recipeId = uuidv4();
                await db.query("INSERT INTO recipes (id, product_id) VALUES (?, ?)", [recipeId, p.id]);
                console.log(`  -> Created new recipe entry for ${p.name}`);
            } else {
                recipeId = recipes[0].id;
            }

            // Check if syrup already exists in recipe_details
            const [details] = await db.query("SELECT id FROM recipe_details WHERE recipe_id = ? AND raw_material_id = ?", [recipeId, syrupId]);

            if (details.length === 0) {
                await db.query(
                    "INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)",
                    [uuidv4(), recipeId, syrupId, 20]
                );
                console.log(`  ✅ Added Sirup Hazelnut (20ml) to ${p.name}`);
            } else {
                console.log(`  ℹ️ Sirup Hazelnut already exists in ${p.name} recipe.`);
            }
        }

        console.log('\nSUCCESS: Hazelnut Latte recipes updated.');
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await db.end();
    }
}

updateHazelnutRecipe();
