const db = require('./src/database/connection');
const { v4: uuidv4 } = require('uuid');

async function seedMaterials() {
    const materials = [
        { name: 'Lemon Tea (Bubuk)', unit: 'gram', min_stock: 500, stock: 1000 },
        { name: 'Matcha (Bubuk)', unit: 'gram', min_stock: 500, stock: 1000 },
        { name: 'Coklat (Bubuk)', unit: 'gram', min_stock: 1000, stock: 2000 },
        { name: 'Thai Tea (Bubuk)', unit: 'gram', min_stock: 500, stock: 1000 }
    ];

    console.log('Memulai seeding data bahan baku...');

    try {
        for (const m of materials) {
            const id = uuidv4();
            await db.query(
                'INSERT INTO raw_materials (id, name, unit, min_stock, stock) VALUES (?, ?, ?, ?, ?)',
                [id, m.name, m.unit, m.min_stock, m.stock]
            );
            console.log(`✅ Berhasil menambahkan: ${m.name}`);
        }
        console.log('\nSemua data berhasil ditambahkan!');
    } catch (error) {
        console.error('\n❌ Gagal menambahkan data:', error.message);
    } finally {
        process.exit();
    }
}

seedMaterials();
