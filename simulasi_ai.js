const mysql = require('mysql2/promise');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

async function createAnomalyDummy() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        console.log('Menyiapkan data simulasi anomali...');

        // IDs based on previous check
        const productId = '1187b118-55dc-42fb-91a3-9aaf00a66151'; // Latte (Panas)
        const materialId = 'a7a99075-19f6-481c-893e-f8d3ec0fa140'; // Susu UHT
        const userId = (await db.query('SELECT id FROM users LIMIT 1'))[0][0].id;

        // 1. Ensure Recipe exists for this product
        await db.query('DELETE FROM product_recipes WHERE product_id = ?', [productId]);
        await db.query('INSERT INTO product_recipes (id, product_id, material_id, quantity) VALUES (?, ?, ?, ?)',
            [uuidv4(), productId, materialId, 150.00]); // 150ml per cup

        // 2. Create Dummy Sales (10 Cups Latte) in last 24h
        const saleId = uuidv4();
        const invoiceNumber = 'INV-SIM-' + Date.now();
        const totalAmount = 250000;
        await db.query('INSERT INTO sales (id, invoice_number, customer_name, total, payment_method, payment_status, creator_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [saleId, invoiceNumber, 'Simulasi AI', totalAmount, 'CASH', 'PAID', userId]);

        await db.query('INSERT INTO sales_items (id, sales_id, product_id, qty, price) VALUES (?, ?, ?, ?, ?)',
            [uuidv4(), saleId, productId, 10, 25000]);

        // Theoretical usage: 10 * 150 = 1500ml

        // 3. Create Actual Stock MOVEMENT 'OUT' (e.g. 5000ml) -> Clear ANOMALY
        // Simulate that 5 liters were recorded as out, but only 1.5 liters should have been used.
        await db.query('INSERT INTO stock_movements (id, raw_material_id, type, qty, note, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [uuidv4(), materialId, 'OUT', 5000.00, 'Simulasi Anomali Stok']);

        console.log('✅ Data simulasi berhasil dibuat!');
        console.log('--- RINGKASAN SIMULASI ---');
        console.log('Produk: Latte (10 Cup terjual)');
        console.log('Kebutuhan Seharusnya: 1.500ml Susu UHT');
        console.log('Pengurangan Stok Riil: 5.000ml Susu UHT');
        console.log('Selisih: 3.500ml (Ini akan dideteksi AI)');
        console.log('---------------------------');
        console.log('Silakan buka halaman REPORT untuk melihat "AI Smart Audit Insight"');

    } catch (error) {
        console.error('Error seeding dummy:', error);
    } finally {
        await db.end();
    }
}

createAnomalyDummy();
