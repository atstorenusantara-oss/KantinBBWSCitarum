const pool = require('./src/database/connection');

async function migrate() {
    try {
        await pool.query('ALTER TABLE attendance ADD COLUMN is_paid TINYINT(1) DEFAULT 0');
        console.log('Migration successful: is_paid column added.');
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column is_paid already exists.');
        } else {
            console.error('Migration failed:', error);
        }
    } finally {
        process.exit();
    }
}

migrate();
