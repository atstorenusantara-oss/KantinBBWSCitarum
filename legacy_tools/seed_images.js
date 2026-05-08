const db = require('./src/database/connection');

async function updateProductImages() {
    const images = {
        "Roti bakar": "https://images.unsplash.com/photo-1584776296976-f8489311665a?q=80&w=400&h=400&fit=crop",
        "Croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&h=400&fit=crop",
        "Espresso": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=400&h=400&fit=crop",
        "Cappuccino": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=400&h=400&fit=crop",
        "Americano": "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=400&h=400&fit=crop",
        "Mocha": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=400&h=400&fit=crop",
        "Vanilla Latte": "https://images.unsplash.com/photo-1595434066389-99c30150fc94?q=80&w=400&h=400&fit=crop",
        "Caramel Latte": "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=400&h=400&fit=crop",
        "Hazelnut Latte": "https://images.unsplash.com/photo-1461023235402-278239b672b1?q=80&w=400&h=400&fit=crop",
        "Flat White": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=400&h=400&fit=crop",
        "Piccolo": "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=400&h=400&fit=crop",
        "Long Black": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&h=400&fit=crop",
        "Affogato": "https://images.unsplash.com/photo-1592663527359-cf6642f54cff?q=80&w=400&h=400&fit=crop",
        "Irish Coffee": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=400&h=400&fit=crop",
        "Cold Brew": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=400&h=400&fit=crop",
        "Latte": "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&h=400&fit=crop"
    };

    console.log('Mengupdate gambar produk...');

    try {
        for (const [name, url] of Object.entries(images)) {
            await db.query('UPDATE products SET image_url = ? WHERE name = ?', [url, name]);
            console.log(`✅ Gambar terupdate untuk: ${name}`);
        }
        console.log('\nSemua gambar produk berhasil diupdate!');
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    } finally {
        process.exit();
    }
}

updateProductImages();
