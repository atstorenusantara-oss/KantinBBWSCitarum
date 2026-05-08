const pool = require('./src/database/connection');

async function debug() {
    try {
        console.log('--- Current User Rates ---');
        const [users] = await pool.query('SELECT id, username, rate_per_minute FROM users');
        console.table(users);

        console.log('\n--- Recent Attendance Log (Internal Data) ---');
        const [att] = await pool.query(`
            SELECT a.id, u.username, a.clock_in, a.clock_out, a.duration_minutes, a.salary_earned, a.overtime_reward, a.late_penalty
            FROM attendance a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.clock_in DESC
            LIMIT 10
        `);
        console.table(att);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

debug();
