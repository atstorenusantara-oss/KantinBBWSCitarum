const db = require('./src/database/connection');
const { v4: uuidv4 } = require('uuid');

async function seedVariants() {
    console.log('🔄 Memulai Konfigurasi Varian Minuman (Panas/Dingin)...');

    try {
        // 1. Ambil id Cup
        const [materials] = await db.query('SELECT id, name FROM raw_materials');
        const cupPlastikId = materials.find(m => m.name.includes('Cup Plastik'))?.id;
        const cupKertasId = materials.find(m => m.name.includes('Cup Kertas'))?.id;
        const bijiKopiId = materials.find(m => m.name.includes('Biji Kopi'))?.id;
        const susuId = materials.find(m => m.name.includes('Susu UHT'))?.id;

        if (!cupPlastikId || !cupKertasId) {
            console.error('❌ Bahan Cup tidak ditemukan! Jalankan script sebelumnya dulu.');
            process.exit(1);
        }

        // 2. Daftar minuman yang akan dibuatkan varian
        const baseDrinks = ['Latte', 'Cappuccino', 'Americano', 'Mocha', 'Vanilla Latte', 'Caramel Latte', 'Hazelnut Latte'];

        for (const name of baseDrinks) {
            // Cek produk original
            const [orig] = await db.query('SELECT * FROM products WHERE name = ?', [name]);
            if (orig.length === 0) continue;

            const baseP = orig[0];

            // Buat Varian Panas
            const [hotExists] = await db.query('SELECT id FROM products WHERE name = ?', [`${name} (Panas)`]);
            if (hotExists.length === 0) {
                const hotId = uuidv4();
                await db.query('INSERT INTO products (id, name, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
                    [hotId, `${name} (Panas)`, baseP.price, baseP.category, baseP.image_url]);

                // Recipe Panas
                const rHotId = uuidv4();
                await db.query('INSERT INTO recipes (id, product_id) VALUES (?, ?)', [rHotId, hotId]);
                await db.query('INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
                    [uuidv4(), rHotId, bijiKopiId, 18, uuidv4(), rHotId, cupKertasId, 1]);
                if (name.includes('Latte') || name === 'Cappuccino' || name === 'Mocha') {
                    await db.query('INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)', [uuidv4(), rHotId, susuId, 200]);
                }
                console.log(`✅ Varian Panas dibuat: ${name}`);
            }

            // Buat Varian Dingin
            const [coldExists] = await db.query('SELECT id FROM products WHERE name = ?', [`${name} (Dingin)`]);
            if (coldExists.length === 0) {
                const coldId = uuidv4();
                await db.query('INSERT INTO products (id, name, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
                    [coldId, `${name} (Dingin)`, baseP.price, baseP.category, baseP.image_url]);

                // Recipe Dingin
                const rColdId = uuidv4();
                await db.query('INSERT INTO recipes (id, product_id) VALUES (?, ?)', [rColdId, coldId]);
                await db.query('INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?), (?, ?, ?, ?)',
                    [uuidv4(), rColdId, bijiKopiId, 18, uuidv4(), rColdId, cupPlastikId, 1]);
                if (name.includes('Latte') || name === 'Cappuccino' || name === 'Mocha') {
                    await db.query('INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)', [uuidv4(), rColdId, susuId, 200]);
                }
                console.log(`✅ Varian Dingin dibuat: ${name}`);
            }

            // Nonaktifkan produk original agar tidak muncul di grid utama (tapi tetap ada id resepnya buat backup)
            await db.query('UPDATE products SET is_active = false WHERE id = ?', [baseP.id]);
        }

        console.log('\n✨ Konfigurasi Varian Selesai!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

seedVariants();
