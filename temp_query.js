const db = require('./src/database/connection');

async function runQuery() {
    try {
        const [stands] = await db.query('SELECT * FROM stands');
        console.log("Stands:", stands);

        const [products] = await db.query('SELECT p.id, p.name, p.category, p.is_active, s.code as stand_code, p.stand_id FROM products p LEFT JOIN stands s ON p.stand_id = s.id');
        console.log("Total Products:", products.length);
        
        const standCProducts = products.filter(p => p.stand_code === 'C' || (p.stand_code && p.stand_code.includes('C')));
        console.log("Stand C Products:");
        console.table(standCProducts);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

runQuery();
