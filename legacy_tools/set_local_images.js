const db = require('./src/database/connection');

async function setLocalImagePaths() {
    console.log('Mengubah path gambar produk ke folder lokal (/assets/img/)...');

    try {
        const [products] = await db.query('SELECT id, name FROM products');

        for (const p of products) {
            // Membuat nama file dari nama produk (contoh: "Es Kopi" -> "es-kopi.jpg")
            const fileName = p.name.toLowerCase().replace(/\s+/g, '-') + '.jpg';
            const localPath = `/assets/img/${fileName}`;

            await db.query('UPDATE products SET image_url = ? WHERE id = ?', [localPath, p.id]);
            console.log(`✅ ${p.name} -> ${localPath}`);
        }

        console.log('\nBerhasil! Sekarang Anda cukup menaruh file gambar di folder public/assets/img/');
        console.log('Pastikan nama filenya sesuai dengan daftar di atas.');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

setLocalImagePaths();
