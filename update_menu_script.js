const db = require('./src/database/connection');
const { v4: uuidv4 } = require('uuid');

async function updateMenu() {
    try {
        console.log('--- REVISI HARGA ---');
        
        // Stand B (Bu Ati) - sa000002...
        await db.query(`UPDATE products SET price = 22500 WHERE name LIKE '%Sop Iga%' AND stand_id = 'sa000002-0000-0000-0000-000000000002'`);
        console.log('Updated Sop Iga Stand B');

        // Stand C (DWP) - sa000003...
        await db.query(`UPDATE products SET price = 15000 WHERE name LIKE '%Mix Jus%' AND stand_id = 'sa000003-0000-0000-0000-000000000003'`);
        await db.query(`UPDATE products SET price = 15000 WHERE name LIKE '%Wortel Jeruk%' AND stand_id = 'sa000003-0000-0000-0000-000000000003'`);
        console.log('Updated Mix Jus & Jeruk Wortel Stand C');

        // Stand A (Bu Jimmy) - sa000001...
        await db.query(`UPDATE products SET price = 25000 WHERE name LIKE '%Nasi Gepuk%' AND stand_id = 'sa000001-0000-0000-0000-000000000001'`);
        await db.query(`UPDATE products SET price = 25000 WHERE name LIKE '%Mie Kocok%' AND stand_id = 'sa000001-0000-0000-0000-000000000001'`);
        console.log('Updated Nasi Gepuk & Mie Kocok Stand A');

        // Stand E (Pa Indra / Bu Marga) - sa000005...
        await db.query(`UPDATE products SET price = 19000 WHERE name LIKE '%Soto Tangkar%' AND stand_id = 'sa000005-0000-0000-0000-000000000005'`);
        console.log('Updated Soto Tangkar Stand E');

        console.log('\n--- TAMBAH ITEM ---');
        
        // Function to insert or update
        async function upsertItem(standId, name, price, category) {
            const [rows] = await db.query('SELECT id FROM products WHERE name = ? AND stand_id = ?', [name, standId]);
            if (rows.length > 0) {
                await db.query('UPDATE products SET price = ?, category = ? WHERE id = ?', [price, category, rows[0].id]);
                console.log(`Updated existing: ${name}`);
            } else {
                await db.query('INSERT INTO products (id, name, price, category, stand_id, is_active) VALUES (?, ?, ?, ?, ?, 1)', [uuidv4(), name, price, category, standId]);
                console.log(`Inserted new: ${name}`);
            }
        }

        // Stand B - sa000002...
        await upsertItem('sa000002-0000-0000-0000-000000000002', 'Tahu/Tempe', 2500, 'Topping');
        await upsertItem('sa000002-0000-0000-0000-000000000002', 'Jukut', 5000, 'Topping');

        // Stand C - sa000003...
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Teh Tarik', 10000, 'Teh & Kopi');
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Kerupuk', 5000, 'Snack'); // Updating price from 3k to 5k
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Roti Pisang Keju', 7500, 'Snack');
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Roti Pisang Coklat', 7500, 'Snack');
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Roti Blueberry Cheese Crumble', 9000, 'Snack');
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Roti Pizza', 9000, 'Snack');
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Roti Vanila Coklat', 9000, 'Snack');
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Roti Cream Cheese Keju', 9000, 'Snack');
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Roti Tabur Seres Keju', 9000, 'Snack');
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Roti Seres Coklat', 9000, 'Snack');
        await upsertItem('sa000003-0000-0000-0000-000000000003', 'Roti Daging Cincang', 9000, 'Snack');

        console.log('\nAll updates finished successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error during execution:', err);
        process.exit(1);
    }
}

updateMenu();
