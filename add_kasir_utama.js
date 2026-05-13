const db = require('./src/database/connection');
const { v4: uuidv4 } = require('uuid');

async function addKasirUtama() {
    try {
        const id = uuidv4();
        // Check if user already exists
        const [existing] = await db.query('SELECT * FROM users WHERE username = "Kasir Utama"');
        if (existing.length > 0) {
            console.log("Kasir Utama user already exists.");
            
            // Just update it to make sure it has the right settings
            await db.query(
                'UPDATE users SET role = "KASIR", stand_id = NULL, pin = "8888" WHERE username = "Kasir Utama"'
            );
            console.log("Updated existing Kasir Utama user.");
        } else {
            await db.query(
                'INSERT INTO users (id, username, pin, role, stand_id) VALUES (?, ?, ?, ?, ?)',
                [id, 'Kasir Utama', '8888', 'KASIR', null]
            );
            console.log("Added new Kasir Utama user with PIN 8888.");
        }
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

addKasirUtama();
