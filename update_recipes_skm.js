const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function addSKMToRecipes() {
    console.log('UPDATING RECIPES WITH SUSU KENTAL MANIS (SKM)...');
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        // 1. AMBIL ID SUSU KENTAL MANIS
        console.log('1. Fetching Susu Kental Manis ID...');
        const [skmSource] = await db.query("SELECT id FROM raw_materials WHERE name = 'Susu Kental Manis'");
        if (skmSource.length === 0) throw new Error('Susu Kental Manis not found in raw_materials!');
        const skmId = skmSource[0].id;

        // 2. DAFTAR MENU YANG SAMA DENGAN SEBELUMNYA
        const targetMenuNames = [
            'Coklat', 'Matcha Latte', 'Red Velvet Creamy', 'Thai Tea',
            'StrawBerry Squash', 'Hazelnut Latte', 'Butterscotch',
            'Vanilla Latte', 'Caramel Latte', 'Kopi Gula Aren',
            'Pandan Latte', 'Kopi Susu'
        ];

        console.log('2. Adding 25g SKM to each menu recipe...');

        for (const baseName of targetMenuNames) {
            // Ambil semua varian
            const [menus] = await db.query(
                "SELECT id, name FROM products WHERE name = ? OR name = ? OR name = ?",
                [baseName, `${baseName} (Panas)`, `${baseName} (Dingin)`]
            );

            for (const menu of menus) {
                // Pastikan Recipe ID ada
                let [recipes] = await db.query("SELECT id FROM recipes WHERE product_id = ?", [menu.id]);
                let recipeId;

                if (recipes.length === 0) {
                    recipeId = uuidv4();
                    await db.query("INSERT INTO recipes (id, product_id) VALUES (?, ?)", [recipeId, menu.id]);
                } else {
                    recipeId = recipes[0].id;
                }

                // Hapus data SKM lama jika ada (biar aman)
                await db.query("DELETE FROM recipe_details WHERE recipe_id = ? AND raw_material_id = ?",
                    [recipeId, skmId]);

                // Tambahkan Susu Kental Manis (25 gram)
                await db.query(
                    "INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)",
                    [uuidv4(), recipeId, skmId, 25]
                );

                console.log(`-> SKM (25g) added for: ${menu.name}`);
            }
        }

        console.log('==========================================');
        console.log('FINISH: 25g Susu Kental Manis added to all target recipes!');
        console.log('==========================================');

    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        await db.end();
    }
}

addSKMToRecipes();
