const db = require('./src/database/connection');

async function diagnostic() {
    try {
        const [tables] = await db.query('SHOW TABLES');
        console.log('--- DATABASE DIAGNOSTIC ---');
        console.log('Tables found:', tables.map(t => Object.values(t)[0]));

        const [expenseCols] = await db.query('SHOW COLUMNS FROM expenses');
        console.log('\nColumns in expenses:', expenseCols.map(c => `${c.Field} (${c.Type})`));

        const [warehouseCols] = await db.query('SHOW COLUMNS FROM warehouse_stock');
        console.log('\nColumns in warehouse_stock:', warehouseCols.map(c => `${c.Field} (${c.Type})`));

        console.log('\nAttempting to get a connection from pool...');
        const conn = await db.getConnection();
        console.log('✅ getConnection() success');
        conn.release();

        process.exit(0);
    } catch (err) {
        console.error('❌ Diagnostic failed:', err);
        process.exit(1);
    }
}

diagnostic();
