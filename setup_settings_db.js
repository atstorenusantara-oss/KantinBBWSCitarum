const db = require('./src/database/connection');

async function setup() {
    try {
        console.log('Inserting ENABLE_MENU_EDITOR setting into existing settings table...');
        await db.query(`
            INSERT IGNORE INTO settings (key_name, value) 
            VALUES ('ENABLE_MENU_EDITOR', '1')
        `);

        console.log('Database setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

setup();
