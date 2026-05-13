const db = require('./src/database/connection');

async function checkRoles() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM users WHERE Field = "role"');
        console.log(columns[0].Type);
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

checkRoles();
