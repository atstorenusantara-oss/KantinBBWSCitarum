const pool = require('./src/database/connection');

async function main() {
    try {
        const [prodCount] = await pool.query("SELECT COUNT(*) as count FROM products WHERE category = 'Es Krim'");
        const [matCount] = await pool.query("SELECT COUNT(*) as count FROM raw_materials WHERE name LIKE 'Joyday%'");
        console.log(`Es Krim Products in DB: ${prodCount[0].count}`);
        console.log(`Joyday Raw Materials in DB: ${matCount[0].count}`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
main();
