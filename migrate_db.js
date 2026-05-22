const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Target paths to update/create .env
const envPaths = [
    path.join(__dirname, '.env'),
    'd:\\Produk INsalusi\\POS\\Kedai-rasta-v1\\Kedai-rasta-v1\\.env'
];

async function runMigration() {
    console.log('==================================================');
    console.log('      MIGRASI DATABASE POS: KEDAI RASATA');
    console.log('==================================================\n');

    // 1. Load config from local .env if exists, otherwise use defaults
    let host = 'localhost';
    let user = 'root';
    let password = 'Insalusi30';
    let sourceDb = 'bbwscitarum'; // default source database
    let targetDb = 'pos_kedai_rasata';

    const localEnvPath = path.join(__dirname, '.env');
    if (fs.existsSync(localEnvPath)) {
        const envContent = fs.readFileSync(localEnvPath, 'utf8');
        const getVal = (key, defaultVal) => {
            const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
            return match ? match[1].trim() : defaultVal;
        };
        host = getVal('DB_HOST', host);
        user = getVal('DB_USER', user);
        password = getVal('DB_PASS', password);
        // If the current config points to another DB, use that as source, but make sure source is not target
        const currentDb = getVal('DB_NAME', sourceDb);
        if (currentDb !== targetDb) {
            sourceDb = currentDb;
        }
    }

    console.log('Konfigurasi MySQL Koneksi:');
    console.log(`- Host: ${host}`);
    console.log(`- User: ${user}`);
    console.log(`- Password: ${password ? '********' : '(kosong)'}`);
    console.log(`- Database Sumber: ${sourceDb}`);
    console.log(`- Database Baru (Target): ${targetDb}\n`);

    console.log('Menghubungkan ke MySQL...');
    let connection;
    try {
        connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password
        });
        console.log('✅ Terhubung ke MySQL server.');
    } catch (err) {
        console.error('❌ Gagal terhubung ke MySQL:', err.message);
        console.log('\nSilakan periksa apakah MySQL aktif dan kredensial di atas sudah benar.');
        process.exit(1);
    }

    try {
        // 2. Buat database target
        console.log(`Membuat database target \`${targetDb}\` (jika belum ada)...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${targetDb}\`;`);
        console.log(`✅ Database \`${targetDb}\` berhasil dibuat/siap.`);

        // 3. Ambil daftar tabel dari database sumber
        console.log(`Mengambil daftar tabel dari database sumber \`${sourceDb}\`...`);
        const [tables] = await connection.query(`SHOW TABLES FROM \`${sourceDb}\`;`);
        const tableNames = tables.map(row => Object.values(row)[0]);
        console.log(`Ditemukan ${tableNames.length} tabel di database sumber.`);

        if (tableNames.length === 0) {
            console.log('❌ Database sumber tidak memiliki tabel untuk disalin. Pastikan database sumber sudah diimpor.');
            process.exit(1);
        }

        // 4. Kloning struktur tabel
        console.log('\nMenduplikasi struktur tabel (tanpa data transaksi)...');
        // Disable foreign key checks temporarily to drop/create safely
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
        for (const tableName of tableNames) {
            console.log(`- Duplikasi tabel: ${tableName}`);
            await connection.query(`DROP TABLE IF EXISTS \`${targetDb}\`.\`${tableName}\`;`);
            await connection.query(`CREATE TABLE \`${targetDb}\`.\`${tableName}\` LIKE \`${sourceDb}\`.\`${tableName}\`;`);
        }
        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
        console.log('✅ Duplikasi seluruh struktur tabel selesai.');

        // 5. Salin data settings dasar dari sourceDb ke targetDb
        console.log('\nMenyalin pengaturan sistem dasar...');
        const [sourceSettings] = await connection.query(`SELECT * FROM \`${sourceDb}\`.settings;`);
        for (const setting of sourceSettings) {
            let val = setting.value;
            // Ubah app_name menjadi Kedai Rasata
            if (setting.key_name === 'app_name') {
                val = 'Kedai Rasata';
            }
            await connection.query(
                `INSERT INTO \`${targetDb}\`.settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?;`,
                [setting.key_name, val, val]
            );
        }
        // Pastikan app_name diatur ke Kedai Rasata
        await connection.query(
            `INSERT INTO \`${targetDb}\`.settings (key_name, value) VALUES ('app_name', 'Kedai Rasata') ON DUPLICATE KEY UPDATE value = 'Kedai Rasata';`
        );
        console.log('✅ Pengaturan dasar disalin (Nama aplikasi: "Kedai Rasata").');

        // 6. Cek apakah ada tabel `stands` di database baru
        const [hasStandsTable] = await connection.query(
            `SHOW TABLES FROM \`${targetDb}\` LIKE 'stands';`
        );

        let defaultStandId = null;
        if (hasStandsTable.length > 0) {
            console.log('Menyiapkan stand default untuk Kedai Rasata...');
            defaultStandId = 'sa000001-0000-0000-0000-000000000001';
            await connection.query(
                `INSERT INTO \`${targetDb}\`.stands (id, code, name, owner_name, description, is_active) 
                 VALUES (?, 'A', 'Stand Utama', 'Owner', 'Stand Utama Kedai Rasata', 1)
                 ON DUPLICATE KEY UPDATE name = 'Stand Utama';`,
                [defaultStandId]
            );
            console.log('✅ Stand default berhasil ditambahkan.');
        }

        // 7. Seed Akun Owner & Kasir Default
        console.log('Menyiapkan akun pengguna awal...');
        const ownerId = 'us000001-0000-0000-0000-000000000001';
        
        // Buat user Owner/Admin
        const ownerQuery = `
            INSERT INTO \`${targetDb}\`.users (id, username, pin, role, stand_id)
            VALUES (?, 'Owner', '0000', 'ADMIN', NULL)
            ON DUPLICATE KEY UPDATE pin = '0000';
        `;
        await connection.query(ownerQuery, [ownerId]);

        // Buat user Kasir default
        const cashierId = 'us000002-0000-0000-0000-000000000002';
        
        // Sesuaikan kolom stand_id jika ada
        const [userCols] = await connection.query(`SHOW COLUMNS FROM \`${targetDb}\`.users LIKE 'stand_id';`);
        if (userCols.length > 0) {
            const cashierQuery = `
                INSERT INTO \`${targetDb}\`.users (id, username, pin, role, stand_id)
                VALUES (?, 'Kasir', '1111', 'KASIR', ?)
                ON DUPLICATE KEY UPDATE pin = '1111';
            `;
            await connection.query(cashierQuery, [cashierId, defaultStandId]);
        } else {
            const cashierQuery = `
                INSERT INTO \`${targetDb}\`.users (id, username, pin, role)
                VALUES (?, 'Kasir', '1111', 'KASIR')
                ON DUPLICATE KEY UPDATE pin = '1111';
            `;
            await connection.query(cashierQuery, [cashierId]);
        }
        console.log('✅ Akun awal dibuat (Owner PIN: 0000, Kasir PIN: 1111).');

        // 8. Perbarui/Buat file `.env` di kedua proyek
        console.log('\nMemperbarui file konfigurasi .env...');
        for (const envPath of envPaths) {
            if (fs.existsSync(envPath)) {
                let content = fs.readFileSync(envPath, 'utf8');
                if (content.includes('DB_NAME=')) {
                    content = content.replace(/DB_NAME=.*/g, `DB_NAME=${targetDb}`);
                    fs.writeFileSync(envPath, content, 'utf8');
                    console.log(`- File diperbarui: ${envPath}`);
                }
            } else {
                // Buat baru jika folder induknya ada
                const parentDir = path.dirname(envPath);
                if (fs.existsSync(parentDir)) {
                    const newEnvContent = `PORT=3000\nDB_HOST=${host}\nDB_USER=${user}\nDB_PASS=${password}\nDB_NAME=${targetDb}\nPRINTER_NAME=RONGTA_58mm\n`;
                    fs.writeFileSync(envPath, newEnvContent, 'utf8');
                    console.log(`- File .env baru dibuat: ${envPath}`);
                }
            }
        }

        console.log('\n==================================================');
        console.log('🎉 MIGRASI SELESAI DAN BERHASIL!');
        console.log('==================================================');
        console.log(`- Database Baru: ${targetDb}`);
        console.log(`- Semua struktur tabel berhasil diduplikasi dari \`${sourceDb}\`.`);
        console.log('- Seluruh riwayat penjualan & transaksi telah dibersihkan (kosong).');
        console.log('- Aplikasi siap dijalankan untuk Kedai Rasata.');
        console.log('- Akun Login Default:');
        console.log('  * Owner/Admin -> Username: Owner, PIN: 0000');
        console.log('  * Staff Kasir -> Username: Kasir, PIN: 1111');
        console.log('==================================================\n');

    } catch (err) {
        console.error('\n❌ Terjadi kesalahan dalam proses migrasi:', err);
    } finally {
        await connection.end();
    }
}

runMigration();
