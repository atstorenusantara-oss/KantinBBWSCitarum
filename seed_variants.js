const db = require('./src/database/connection');
const { v4: uuidv4 } = require('uuid');

async function seedVariants() {
    console.log('🔄 Memulai Konfigurasi Varian Minuman (Panas/Dingin) Dinamis...');

    try {
        // 1. Ambil ID Bahan Baku penting
        const [materials] = await db.query('SELECT id, name FROM raw_materials');
        const cupPlastikId = materials.find(m => m.name.toLowerCase().includes('cup plastik'))?.id;
        const cupKertasId = materials.find(m => m.name.toLowerCase().includes('cup kertas'))?.id;
        const bijiKopiId = materials.find(m => m.name.toLowerCase().includes('biji kopi'))?.id;
        const susuId = materials.find(m => m.name.toLowerCase().includes('susu uht'))?.id;

        if (!cupPlastikId || !cupKertasId) {
            console.error('❌ Bahan Cup tidak ditemukan! Pastikan raw_materials sudah terisi.');
            process.exit(1);
        }

        // 2. Ambil semua produk yang termasuk kategori minuman
        const beverageCategories = ['Espresso Based', 'Milk Based', 'Manual Brew', 'Non-Coffee'];
        const [baseDrinks] = await db.query(
            "SELECT * FROM products WHERE category IN (?) AND name NOT LIKE '%(Panas)%' AND name NOT LIKE '%(Dingin)%'",
            [beverageCategories]
        );

        console.log(`🔎 Ditemukan ${baseDrinks.length} minuman dasar untuk diproses.`);

        for (const baseP of baseDrinks) {
            const name = baseP.name;

            // --- Varian Panas ---
            const [hotExists] = await db.query('SELECT id FROM products WHERE name = ?', [`${name} (Panas)`]);
            if (hotExists.length === 0) {
                const hotId = uuidv4();
                await db.query('INSERT INTO products (id, name, price, category, image_url, is_active) VALUES (?, ?, ?, ?, ?, true)',
                    [hotId, `${name} (Panas)`, baseP.price, baseP.category, baseP.image_url]);

                // Recipe Panas
                const rHotId = uuidv4();
                await db.query('INSERT INTO recipes (id, product_id) VALUES (?, ?)', [rHotId, hotId]);

                // Tambahkan Cup Kertas (Wajib Panas)
                await db.query('INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)',
                    [uuidv4(), rHotId, cupKertasId, 1]);

                // Tambah Biji Kopi jika mengandung kopi
                if (baseP.category.includes('Espresso') || baseP.category.includes('Milk Based') || baseP.category.includes('Manual')) {
                    if (bijiKopiId) await db.query('INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)', [uuidv4(), rHotId, bijiKopiId, 18]);
                }

                // Tambah Susu jika Milk Based
                if (baseP.category === 'Milk Based' && susuId) {
                    await db.query('INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)', [uuidv4(), rHotId, susuId, 200]);
                }

                console.log(`   🔥 Varian Panas: ${name}`);
            }

            // --- Varian Dingin ---
            const [coldExists] = await db.query('SELECT id FROM products WHERE name = ?', [`${name} (Dingin)`]);
            if (coldExists.length === 0) {
                const coldId = uuidv4();
                await db.query('INSERT INTO products (id, name, price, category, image_url, is_active) VALUES (?, ?, ?, ?, ?, true)',
                    [coldId, `${name} (Dingin)`, baseP.price, baseP.category, baseP.image_url]);

                // Recipe Dingin
                const rColdId = uuidv4();
                await db.query('INSERT INTO recipes (id, product_id) VALUES (?, ?)', [rColdId, coldId]);

                // Tambahkan Cup Plastik (Wajib Dingin)
                await db.query('INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)',
                    [uuidv4(), rColdId, cupPlastikId, 1]);

                // Tambah Biji Kopi jika mengandung kopi
                if (baseP.category.includes('Espresso') || baseP.category.includes('Milk Based') || baseP.category.includes('Manual')) {
                    if (bijiKopiId) await db.query('INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)', [uuidv4(), rColdId, bijiKopiId, 18]);
                }

                // Tambah Susu jika Milk Based
                if (baseP.category === 'Milk Based' && susuId) {
                    await db.query('INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)', [uuidv4(), rColdId, susuId, 200]);
                }

                console.log(`   ❄️ Varian Dingin: ${name}`);
            }

            // Pastikan produk base TETAP AKTIF agar muncul di menu utama (sebagai trigger modal)
            await db.query('UPDATE products SET is_active = true WHERE id = ?', [baseP.id]);
        }

        console.log('\n✨ Semua minuman sekarang memiliki opsi Panas/Dingin!');
    } catch (error) {
        console.error('❌ Terjadi kesalahan:', error);
    } finally {
        process.exit();
    }
}

seedVariants();
