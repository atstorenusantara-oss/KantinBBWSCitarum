const pool = require('./src/database/connection');

async function main() {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log('Transaction started.');

        // Update products
        const [prodResult] = await connection.query(
            "UPDATE products SET name = REPLACE(name, 'Joyday ', '') WHERE category = 'Es Krim' AND name LIKE 'Joyday %'"
        );
        console.log(`Updated ${prodResult.affectedRows} products.`);

        // Update raw_materials
        const [matResult] = await connection.query(
            "UPDATE raw_materials SET name = REPLACE(name, 'Joyday ', '') WHERE name LIKE 'Joyday %'"
        );
        console.log(`Updated ${matResult.affectedRows} raw materials.`);

        await connection.commit();
        console.log('Transaction committed successfully.');
        process.exit(0);
    } catch (e) {
        await connection.rollback();
        console.error('Error during rename operation:', e);
        process.exit(1);
    } finally {
        connection.release();
    }
}
main();
