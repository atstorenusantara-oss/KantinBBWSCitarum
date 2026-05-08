const pool = require('./src/database/connection');

async function migrate() {
    try {
        // Add status column to distinguish planned vs active vs completed
        // PLANNED: Scheduled by admin
        // ACTIVE: Staff has clocked in
        // DONE: Shift completed
        await pool.query("ALTER TABLE attendance ADD COLUMN status VARCHAR(20) DEFAULT 'DONE'");

        // Mark future shifts as PLANNED
        await pool.query("UPDATE attendance SET status = 'PLANNED' WHERE clock_in > NOW()");

        // Mark currently active shifts (clock_out is null) as ACTIVE
        await pool.query("UPDATE attendance SET status = 'ACTIVE' WHERE clock_out IS NULL");

        console.log('Migration successful: status column added to attendance.');
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column status already exists.');
        } else {
            console.error('Migration failed:', error);
        }
    } finally {
        process.exit();
    }
}

migrate();
