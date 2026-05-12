-- ============================================================
-- MIGRATION: G-Coffee POS → Kantin BBWS Citarum
-- Reset semua data lama, setup multi-stand
-- ============================================================

USE bbwscitarum;
SET FOREIGN_KEY_CHECKS = 0;

-- STEP 1: Hapus semua data lama
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE attendance;
TRUNCATE TABLE expenses;
TRUNCATE TABLE product_recipes;
TRUNCATE TABLE raw_materials;
TRUNCATE TABLE recipe_details;
TRUNCATE TABLE recipes;
TRUNCATE TABLE sales_items;
TRUNCATE TABLE sales;
TRUNCATE TABLE stock_movements;
TRUNCATE TABLE stock_opnames;
TRUNCATE TABLE users;
TRUNCATE TABLE void_logs;
TRUNCATE TABLE warehouse_stock;
TRUNCATE TABLE settings;
DELETE FROM products;

SET FOREIGN_KEY_CHECKS = 1;

-- STEP 2: Buat tabel stands
DROP TABLE IF EXISTS stands;
CREATE TABLE stands (
  id VARCHAR(36) NOT NULL,
  code VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL,
  owner_name VARCHAR(100),
  description TEXT,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- STEP 3: Tambah kolom stand_id ke tabel existing
ALTER TABLE products ADD COLUMN IF NOT EXISTS stand_id VARCHAR(36) DEFAULT NULL;
ALTER TABLE sales ADD COLUMN IF NOT EXISTS stand_id VARCHAR(36) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stand_id VARCHAR(36) DEFAULT NULL;

-- STEP 4: Seed tabel stands
INSERT INTO stands (id, code, name, owner_name, description) VALUES
('sa000001-0000-0000-0000-000000000001', 'A', 'Stand A', 'Bu Jimmy', 'Tutug Oncom, Nasi Gepuk, Seafood, Lotek, Karedok'),
('sa000002-0000-0000-0000-000000000002', 'B', 'Stand B', 'Bu Ati', 'Warmindo, Lontong Kari, Sop Iga, Rice Bowl'),
('sa000003-0000-0000-0000-000000000003', 'C', 'Stand C (DWP)', 'DWP', 'Jus, Kopi, Teh, Minuman & Snack'),
('sa000004-0000-0000-0000-000000000004', 'D', 'Stand D', 'Bu Suminah', 'Rawon, Geprek, Pepes, Bihun, Salad'),
('sa000005-0000-0000-0000-000000000005', 'E', 'Stand E', 'Pa Indra / Bu Marga', 'Soto Tangkar, Ayam Goreng, Lauk'),
('sa000006-0000-0000-0000-000000000006', 'F1', 'Stand F1', 'Mang Nunu', 'Batagor, Baso Tahu, Yamin, Mie Baso'),
('sa000007-0000-0000-0000-000000000007', 'F2', 'Stand F2', 'Bu Kimun', 'Bubur, Ikan Bakar, Seblak, Pempek');

-- STEP 5: Seed users (1 owner + 7 kasir)
INSERT INTO users (id, username, pin, role, stand_id) VALUES
('us000001-0000-0000-0000-000000000001', 'Owner', '0000', 'ADMIN', NULL),
('us000002-0000-0000-0000-000000000002', 'KasirA', '1111', 'KASIR', 'sa000001-0000-0000-0000-000000000001'),
('us000003-0000-0000-0000-000000000003', 'KasirB', '2222', 'KASIR', 'sa000002-0000-0000-0000-000000000002'),
('us000004-0000-0000-0000-000000000004', 'KasirC', '3333', 'KASIR', 'sa000003-0000-0000-0000-000000000003'),
('us000005-0000-0000-0000-000000000005', 'KasirD', '4444', 'KASIR', 'sa000004-0000-0000-0000-000000000004'),
('us000006-0000-0000-0000-000000000006', 'KasirE', '5555', 'KASIR', 'sa000005-0000-0000-0000-000000000005'),
('us000007-0000-0000-0000-000000000007', 'KasirF1', '6611', 'KASIR', 'sa000006-0000-0000-0000-000000000006'),
('us000008-0000-0000-0000-000000000008', 'KasirF2', '6622', 'KASIR', 'sa000007-0000-0000-0000-000000000007');

-- STEP 6: Seed settings
INSERT INTO settings (key_name, value) VALUES
('shift_1_start', '07:00'),
('shift_1_end', '17:00'),
('shift_2_end', '21:00'),
('show_shutdown', 'OFF'),
('default_print', 'OFF'),
('virtual_keyboard', 'ON'),
('app_name', 'Kantin BBWS Citarum');

-- ============================================================
-- STEP 7: Seed Products per Stand
-- ============================================================

-- == STAND A (Bu Jimmy) ==
INSERT INTO products (id, name, price, category, stand_id, is_active) VALUES
(UUID(), 'Tutug Oncom Ayam', 23000, 'Makanan Utama', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Tutug Oncom Asin', 23000, 'Makanan Utama', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Chicken Katsu Steak', 27000, 'Makanan Utama', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Nasi Gepuk', 25000, 'Makanan Utama', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Gepuk', 20000, 'Lauk', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Nasi Lotek/Karedok', 20000, 'Makanan Utama', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Lotek', 15000, 'Lauk', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Karedok', 15000, 'Lauk', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Nasi Goreng Telor Kribo/Kornet', 20000, 'Makanan Utama', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Telor Kribo', 5000, 'Lauk', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Mie Kocok', 20000, 'Makanan Utama', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Gorengan 1 Porsi', 5000, 'Lauk', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Seafood Saus Padang & Asam Manis', 25000, 'Makanan Utama', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Pisang Keju', 15000, 'Lauk', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Nasi Pesmol', 22000, 'Makanan Utama', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Pesmol Saja', 17000, 'Lauk', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Topping Tahu', 2000, 'Topping', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Topping Tempe', 2000, 'Topping', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Topping Sambal Daun Jeruk', 5000, 'Topping', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Topping Sambal Dadak', 5000, 'Topping', 'sa000001-0000-0000-0000-000000000001', 1),
(UUID(), 'Nasi Saja', 5000, 'Topping', 'sa000001-0000-0000-0000-000000000001', 1);

-- == STAND B (Bu Ati) ==
INSERT INTO products (id, name, price, category, stand_id, is_active) VALUES
(UUID(), 'Warmindo', 15000, 'Makanan', 'sa000002-0000-0000-0000-000000000002', 1),
(UUID(), 'Lontong Kari', 15000, 'Makanan', 'sa000002-0000-0000-0000-000000000002', 1),
(UUID(), 'Nasi Sop Iga', 22500, 'Makanan', 'sa000002-0000-0000-0000-000000000002', 1),
(UUID(), 'Kupat Tahu Petis', 15000, 'Makanan', 'sa000002-0000-0000-0000-000000000002', 1),
(UUID(), 'Aneka Kukusan', 15000, 'Makanan', 'sa000002-0000-0000-0000-000000000002', 1),
(UUID(), 'Rice Bowl Sayap Pedas', 22500, 'Nasi Bowl', 'sa000002-0000-0000-0000-000000000002', 1),
(UUID(), 'Nasi Ayam Cabe Ijo', 22500, 'Nasi Bowl', 'sa000002-0000-0000-0000-000000000002', 1),
(UUID(), 'Topping Telor', 5000, 'Topping', 'sa000002-0000-0000-0000-000000000002', 1),
(UUID(), 'Topping Nasi', 5000, 'Topping', 'sa000002-0000-0000-0000-000000000002', 1),
(UUID(), 'Topping Lontong', 5000, 'Topping', 'sa000002-0000-0000-0000-000000000002', 1);

-- == STAND C (DWP) - Minuman ==
INSERT INTO products (id, name, price, category, stand_id, is_active) VALUES
(UUID(), 'Jus Nanas', 13000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Jus Tomat', 13000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Jus Belimbing', 13000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Jus Jambu', 13000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Jus Kaweni', 13000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Jus Alpukat', 15000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Jus Strawberry', 15000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Jus Buah Naga', 15000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Es Jeruk', 10000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Mix Jus Wortel Jeruk', 15000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Mix Jus (Bebas Pilih)', 15000, 'Jus Buah', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Teh Sereh Lemon', 10000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Teh Sereh Jahe Lemon', 10000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Kopi Kapal Api (Panas)', 5000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Kopi Kapal Api (Dingin)', 8000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Indocafe (Panas)', 5000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Indocafe (Dingin)', 8000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Goodday Moccacino (Panas)', 5000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Goodday Moccacino (Dingin)', 8000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'ABC Susu (Panas)', 5000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'ABC Susu (Dingin)', 8000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Luwak White Coffee (Panas)', 5000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Luwak White Coffee (Dingin)', 8000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Kopi Pahit (Panas)', 5000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Kopi Pahit (Dingin)', 8000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Goodday Cappucino (Panas)', 5000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Goodday Cappucino (Dingin)', 8000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Milo (Panas)', 5000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Milo (Dingin)', 10000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'STMJ', 5000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Lemon Tea (Panas)', 10000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Lemon Tea (Dingin)', 10000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Hot Coklat', 10000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Matcha', 15000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Creamy Latte Kulate (Panas)', 15000, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Creamy Latte Kulate (Dingin)', 18500, 'Teh & Kopi', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Ice Nutrisari', 5000, 'Minuman Lain', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Kerupuk', 3000, 'Snack', 'sa000003-0000-0000-0000-000000000003', 1),
(UUID(), 'Dimsum', 20000, 'Snack', 'sa000003-0000-0000-0000-000000000003', 1);

-- == STAND D (Bu Suminah) ==
INSERT INTO products (id, name, price, category, stand_id, is_active) VALUES
(UUID(), 'Rawon + Telur Asin + Emping', 22000, 'Masakan Utama', 'sa000004-0000-0000-0000-000000000004', 1),
(UUID(), 'Sayur Lodeh + Lauk + Tahu/Tempe', 22000, 'Masakan Utama', 'sa000004-0000-0000-0000-000000000004', 1),
(UUID(), 'Ayam Geprek', 20000, 'Masakan Utama', 'sa000004-0000-0000-0000-000000000004', 1),
(UUID(), 'Ceker Mercon', 20000, 'Masakan Utama', 'sa000004-0000-0000-0000-000000000004', 1),
(UUID(), 'Pepes Ayam + Nasi', 22000, 'Masakan Utama', 'sa000004-0000-0000-0000-000000000004', 1),
(UUID(), 'Pepes Ikan + Nasi', 22000, 'Masakan Utama', 'sa000004-0000-0000-0000-000000000004', 1),
(UUID(), 'Sayur Bening + Lauk + Sambel', 22000, 'Masakan Utama', 'sa000004-0000-0000-0000-000000000004', 1),
(UUID(), 'Bihun Goreng', 15000, 'Snack', 'sa000004-0000-0000-0000-000000000004', 1),
(UUID(), 'Roti Bakar', 15000, 'Snack', 'sa000004-0000-0000-0000-000000000004', 1),
(UUID(), 'Salad', 15000, 'Snack', 'sa000004-0000-0000-0000-000000000004', 1);

-- == STAND E (Pa Indra / Bu Marga) ==
INSERT INTO products (id, name, price, category, stand_id, is_active) VALUES
(UUID(), 'Paket Nasi Soto Tangkar', 23000, 'Paket Nasi', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Soto Tangkar', 19000, 'Lauk', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Paket Nasi Ayam Goreng', 23000, 'Paket Nasi', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Ayam Goreng', 17000, 'Lauk', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Usus Goreng', 12000, 'Lauk', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Tahu / Tempe', 2500, 'Pelengkap', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Sempol Ayam (4 pcs)', 5000, 'Pelengkap', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Nasi Putih', 5000, 'Pelengkap', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Perkedel Kentang', 4000, 'Pelengkap', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Telor Balado', 5000, 'Pelengkap', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Rendang Ati Ampela', 5000, 'Pelengkap', 'sa000005-0000-0000-0000-000000000005', 1),
(UUID(), 'Tumisan', 5000, 'Pelengkap', 'sa000005-0000-0000-0000-000000000005', 1);

-- == STAND F1 (Mang Nunu) ==
INSERT INTO products (id, name, price, category, stand_id, is_active) VALUES
(UUID(), 'Batagor', 15000, 'Batagor & Baso', 'sa000006-0000-0000-0000-000000000006', 1),
(UUID(), 'Baso Tahu (10k)', 10000, 'Batagor & Baso', 'sa000006-0000-0000-0000-000000000006', 1),
(UUID(), 'Baso Tahu (15k)', 15000, 'Batagor & Baso', 'sa000006-0000-0000-0000-000000000006', 1),
(UUID(), 'Baso Tahu (25k)', 25000, 'Batagor & Baso', 'sa000006-0000-0000-0000-000000000006', 1),
(UUID(), 'Baso Tahu (30k)', 30000, 'Batagor & Baso', 'sa000006-0000-0000-0000-000000000006', 1),
(UUID(), 'Yamin Pisah Kuah', 20000, 'Mie', 'sa000006-0000-0000-0000-000000000006', 1),
(UUID(), 'Mie Baso Biasa', 20000, 'Mie', 'sa000006-0000-0000-0000-000000000006', 1);

-- == STAND F2 (Bu Kimun) ==
INSERT INTO products (id, name, price, category, stand_id, is_active) VALUES
(UUID(), 'Bubur Ayam', 15000, 'Bubur & Nasi', 'sa000007-0000-0000-0000-000000000007', 1),
(UUID(), 'Nasi + Ayam/Nila Bakar', 23000, 'Bubur & Nasi', 'sa000007-0000-0000-0000-000000000007', 1),
(UUID(), 'Nasi + Ayam/Nila/Mas/Lele Goreng', 22500, 'Bubur & Nasi', 'sa000007-0000-0000-0000-000000000007', 1),
(UUID(), 'Seblak', 15000, 'Jajanan', 'sa000007-0000-0000-0000-000000000007', 1),
(UUID(), 'Pempek', 15000, 'Jajanan', 'sa000007-0000-0000-0000-000000000007', 1),
(UUID(), 'Tumisan', 5000, 'Jajanan', 'sa000007-0000-0000-0000-000000000007', 1),
(UUID(), 'Topping Tahu/Tempe', 2000, 'Topping', 'sa000007-0000-0000-0000-000000000007', 1),
(UUID(), 'Topping Telur Dadar', 6000, 'Topping', 'sa000007-0000-0000-0000-000000000007', 1),
(UUID(), 'Topping Perkedel Jagung', 3000, 'Topping', 'sa000007-0000-0000-0000-000000000007', 1),
(UUID(), 'Topping Seblak', 5000, 'Topping', 'sa000007-0000-0000-0000-000000000007', 1);

-- Verifikasi hasil
SELECT s.code, s.name, COUNT(p.id) as total_produk 
FROM stands s 
LEFT JOIN products p ON p.stand_id = s.id 
GROUP BY s.id 
ORDER BY s.code;

SELECT username, role, COALESCE(st.name, 'Semua Stand') as stand
FROM users u
LEFT JOIN stands st ON u.stand_id = st.id;
