-- ============================================================
-- SQL SCRIPT UNTUK UPDATE DATABASE DI PC KASIR
-- Jalankan query ini di database 'bbwscitarum' lewat SQLyog / phpMyAdmin
-- ============================================================

USE bbwscitarum;

-- 1. Tambah Stand G (sosro&eskrim) jika belum terdaftar
INSERT INTO stands (id, code, name, owner_name, description, is_active)
VALUES ('sa000008-0000-0000-0000-000000000008', 'G', 'sosro&eskrim', 'DWP', 'Stand khusus Sosro dan Es Krim', 1)
ON DUPLICATE KEY UPDATE name = 'sosro&eskrim', owner_name = 'DWP';

-- 2. Hapus KasirG jika pernah terbuat karena digabung dengan KasirC
DELETE FROM users WHERE username = 'KasirG';

-- 3. Pindahkan semua produk yang memiliki resep/stok opname ke Stand G
-- Produk yang memiliki resep terdaftar di tabel `recipes` atau `product_recipes`
UPDATE products 
SET stand_id = 'sa000008-0000-0000-0000-000000000008' 
WHERE id IN (
    SELECT DISTINCT product_id FROM recipes
) OR id IN (
    SELECT DISTINCT product_id FROM product_recipes
);

-- 4. Verifikasi jumlah produk yang berhasil dipindahkan ke Stand G
SELECT s.code, s.name, COUNT(p.id) as total_produk 
FROM stands s 
LEFT JOIN products p ON p.stand_id = s.id 
GROUP BY s.id;
