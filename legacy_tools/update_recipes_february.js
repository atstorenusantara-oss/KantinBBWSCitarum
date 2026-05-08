const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function updateRecipes() {
    console.log('UPDATING RECIPES AND RAW MATERIALS...');
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        // 1. TAMBAHKAN CREAMER BUBUK KE TABEL RAW_MATERIALS
        console.log('1. Checking Creamer Powder in raw_materials...');
        const [existingCreamer] = await db.query("SELECT id FROM raw_materials WHERE name = 'Creamer Bubuk'");
        let creamerId;

        if (existingCreamer.length === 0) {
            creamerId = uuidv4();
            await db.query(
                "INSERT INTO raw_materials (id, name, unit, stock, min_stock) VALUES (?, 'Creamer Bubuk', 'gram', 0, 1000)",
                [creamerId]
            );
            console.log('-> Creamer Bubuk added successfully.');
        } else {
            creamerId = existingCreamer[0].id;
            console.log('-> Creamer Bubuk already exists.');
        }

        // 2. AMBIL ID SUSU UHT
        const [uhtSource] = await db.query("SELECT id FROM raw_materials WHERE name = 'Susu UHT'");
        if (uhtSource.length === 0) throw new Error('Susu UHT not found in raw_materials!');
        const uhtId = uhtSource[0].id;

        // 3. DAFTAR MENU YANG MENGGUNAKAN CREAMER & UHT
        const targetMenuNames = [
            'Coklat', 'Matcha Latte', 'Red Velvet Creamy', 'Thai Tea',
            'StrawBerry Squash', 'Hazelnut Latte', 'Butterscotch',
            'Vanilla Latte', 'Caramel Latte', 'Kopi Gula Aren',
            'Pandan Latte', 'Kopi Susu'
        ];

        console.log('2. Updating Recipe Details for specified menus...');

        for (const baseName of targetMenuNames) {
            // Kita cari semua varian produk (Base, Panas, Dingin)
            const [menus] = await db.query(
                "SELECT id, name FROM products WHERE name = ? OR name = ? OR name = ?",
                [baseName, `${baseName} (Panas)`, `${baseName} (Dingin)`]
            );

            for (const menu of menus) {
                // Cari atau buat Recipe ID untuk produk ini
                let [recipes] = await db.query("SELECT id FROM recipes WHERE product_id = ?", [menu.id]);
                let recipeId;

                if (recipes.length === 0) {
                    recipeId = uuidv4();
                    await db.query("INSERT INTO recipes (id, product_id) VALUES (?, ?)", [recipeId, menu.id]);
                } else {
                    recipeId = recipes[0].id;
                }

                // Hapus detail lama untuk UHT/Creamer jika ada (biar tidak double saat re-run)
                await db.query("DELETE FROM recipe_details WHERE recipe_id = ? AND raw_material_id IN (?, ?)",
                    [recipeId, uhtId, creamerId]);

                // Tambahkan Creamer (12 gram)
                await db.query(
                    "INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)",
                    [uuidv4(), recipeId, creamerId, 12]
                );

                // Tambahkan UHT (100 ml)
                await db.query(
                    "INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)",
                    [uuidv4(), recipeId, uhtId, 100]
                );

                console.log(`-> Recipe updated for: ${menu.name}`);
            }
        }

        console.log('==========================================');
        console.log('FINISH: Creamer Bubuk added & Recipes Updated!');
        console.log('==========================================');

    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        await db.end();
    }
}

updateRecipes();
