const db = require('./src/database/connection');
const { v4: uuidv4 } = require('uuid');

async function seedRecipes() {
    console.log('Memulai seeding resep standar...');

    try {
        // 1. Ambil data produk dan bahan baku untuk mendapatkan ID-nya
        const [products] = await db.query('SELECT id, name FROM products');
        const [materials] = await db.query('SELECT id, name FROM raw_materials');

        const findP = (name) => products.find(p => p.name.toLowerCase().includes(name.toLowerCase()))?.id;
        const findM = (name) => materials.find(m => m.name.toLowerCase().includes(name.toLowerCase()))?.id;

        // Definisi Resep Standar
        const recipeList = [
            {
                product: 'Espresso',
                items: [
                    { name: 'Biji Kopi', qty: 18 }
                ]
            },
            {
                product: 'Latte',
                items: [
                    { name: 'Biji Kopi', qty: 18 },
                    { name: 'Susu UHT', qty: 200 },
                    { name: 'Gula Cair', qty: 20 }
                ]
            },
            {
                product: 'Cappuccino',
                items: [
                    { name: 'Biji Kopi', qty: 18 },
                    { name: 'Susu UHT', qty: 150 }
                ]
            },
            {
                product: 'Americano',
                items: [
                    { name: 'Biji Kopi', qty: 18 }
                ]
            },
            {
                product: 'Mocha',
                items: [
                    { name: 'Biji Kopi', qty: 18 },
                    { name: 'Susu UHT', qty: 150 },
                    { name: 'Coklat (Bubuk)', qty: 25 }
                ]
            },
            {
                product: 'Vanilla Latte',
                items: [
                    { name: 'Biji Kopi', qty: 18 },
                    { name: 'Susu UHT', qty: 200 },
                    { name: 'Gula Cair', qty: 25 }
                ]
            },
            {
                product: 'Thai Tea',
                items: [
                    { name: 'Thai Tea (Bubuk)', qty: 25 },
                    { name: 'Susu UHT', qty: 200 },
                    { name: 'Gula Cair', qty: 30 }
                ]
            },
            {
                product: 'Matcha Latte', // Jika ada menu Matcha di produk
                items: [
                    { name: 'Matcha (Bubuk)', qty: 20 },
                    { name: 'Susu UHT', qty: 200 },
                    { name: 'Gula Cair', qty: 20 }
                ]
            }
        ];

        for (const r of recipeList) {
            const productId = findP(r.product);
            if (!productId) {
                console.log(`⚠️ Produk tidak ditemukan: ${r.product}, skip...`);
                continue;
            }

            // Cek apakah resep sudah ada
            const [existing] = await db.query('SELECT id FROM recipes WHERE product_id = ?', [productId]);
            let recipeId;

            if (existing.length > 0) {
                recipeId = existing[0].id;
                // Hapus detail lama agar tidak duplikat saat seeding ulang
                await db.query('DELETE FROM recipe_details WHERE recipe_id = ?', [recipeId]);
                console.log(`♻️ Update resep untuk: ${r.product}`);
            } else {
                recipeId = uuidv4();
                await db.query('INSERT INTO recipes (id, product_id) VALUES (?, ?)', [recipeId, productId]);
                console.log(`✅ Buat resep baru untuk: ${r.product}`);
            }

            // Masukkan detail resep
            for (const item of r.items) {
                const materialId = findM(item.name);
                if (materialId) {
                    await db.query(
                        'INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)',
                        [uuidv4(), recipeId, materialId, item.qty]
                    );
                    console.log(`   - Tambah bahan: ${item.name} (${item.qty})`);
                } else {
                    console.log(`   ❌ Bahan tidak ditemukan: ${item.name}`);
                }
            }
        }

        console.log('\nSeeding resep selesai!');
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    } finally {
        process.exit();
    }
}

seedRecipes();
