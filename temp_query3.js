const db = require('./src/database/connection');

async function runQuery() {
    try {
        const [stands] = await db.query('SELECT * FROM stands WHERE code = "C"');
        const standId = stands[0].id;
        
        const [categories] = await db.query('SELECT DISTINCT category FROM products WHERE is_active = 1 AND stand_id = ? ORDER BY category', [standId]);
        console.log("Active Categories for Stand C:", categories);
        
        const [allCategories] = await db.query('SELECT DISTINCT category FROM products WHERE stand_id = ? ORDER BY category', [standId]);
        console.log("All Categories for Stand C (including inactive):", allCategories);

        const [products] = await db.query('SELECT id, name, category, is_active FROM products WHERE stand_id = ?', [standId]);
        console.log(`Total Products for Stand C: ${products.length}`);
        
        const activeProducts = products.filter(p => p.is_active === 1);
        console.log(`Active Products for Stand C: ${activeProducts.length}`);
        
        console.log("Categories of active products:");
        const categoryCounts = {};
        activeProducts.forEach(p => {
            categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        });
        console.log(categoryCounts);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

runQuery();
