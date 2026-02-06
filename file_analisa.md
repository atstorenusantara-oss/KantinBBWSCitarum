# Analisa Teknologi & Database  
## Sistem Kasir Kedai Kopi Terintegrasi Stok Bahan Baku  
Teknologi: **Node.js + MySQL**

---

## 1. Gambaran Umum Sistem

Sistem ini adalah **Point of Sale (POS)** untuk kedai kopi yang terhubung langsung dengan **manajemen stok bahan baku berbasis resep**.  
Setiap penjualan akan otomatis mengurangi stok bahan sesuai takaran resep (BOM).

Tujuan utama:
- Sinkronisasi penjualan & stok
- Kontrol takaran & pemborosan
- Perhitungan HPP akurat
- Audit stok yang jelas

---

## 2. Arsitektur Sistem

```
[Frontend Kasir & BMS]
(Web / Tablet / PC)
        |
        v
[Backend API - Node.js]
(Express / Fastify)
        |          |
        v          v
[MySQL DB]   [ESP32 / IoT Devices]
        |
        v
[Printer Kasir Thermal]
```

Karakteristik:
- Real-time
- Transaction-safe
- Siap dikembangkan multi-outlet

---

## 3. Analisa Teknologi Backend (Node.js)

### 3.1 Alasan Menggunakan Node.js
- Event-driven & cepat
- Cocok untuk transaksi kasir
- Mudah integrasi printer & device
- Ekosistem library besar

### 3.2 Stack Backend yang Disarankan
- Node.js ≥ 18
- Express.js / Fastify
- mysql2 (support transaction)
- Prisma / Sequelize (opsional ORM)
- dotenv
- uuid
- dayjs
- joi / zod (validasi input)

### 3.3 Struktur Folder Backend
```
src/
 ├─ app.js
 ├─ routes/
 ├─ controllers/
 ├─ services/
 │   ├─ sales.service.js
 │   ├─ stock.service.js
 ├─ models/
 ├─ database/
 │   └─ connection.js
 └─ utils/
```

---

## 4. Alur Transaksi Penjualan (Critical Logic)

```
BEGIN TRANSACTION
  INSERT sales
  INSERT sales_items
  SELECT recipe_details
  UPDATE raw_materials.stock
  INSERT stock_movements
COMMIT
```

Jika gagal:
```
ROLLBACK
```

Tujuan:
- Tidak ada stok minus
- Data penjualan & stok selalu konsisten

---

## 5. Analisa Database (MySQL)

### 5.1 Alasan Menggunakan MySQL
- Stabil & mature
- Support ACID transaction
- Cocok untuk POS
- Mudah backup & restore

### 5.2 Konfigurasi Wajib
- Storage Engine: **InnoDB**
- Gunakan Foreign Key
- Gunakan Index
- Gunakan DECIMAL untuk harga & stok

---

## 6. Diagram Alur Sistem

### 6.1 Alur Penjualan
```
[Mulai]
   |
[Kasir pilih produk]
   |
[Input qty]
   |
[Sistem ambil resep]
   |
[Hitung kebutuhan bahan]
   |
[Validasi stok]
   |---- stok kurang ---> [Tolak transaksi]
   |
[Simpan transaksi]
   |
[Kurangi stok bahan]
   |
[Cetak struk]
   |
[Selesai]
```

### 6.2 Alur Stock Opname
```
[Mulai]
   |
[Input stok fisik]
   |
[Bandingkan stok sistem]
   |
[Hitung selisih]
   |
[Simpan adjustment]
   |
[Laporan]
   |
[Selesai]
```

### 6.3 Alur Laporan Penjualan (Harian/Mingguan/Bulanan)
```
[Mulai]
   |
[Pilih Filter Waktu]
   |
[Query database tabel sales]
   |
[Agregasi data (SUM total)]
   |
[Hitung performa produk terlaris]
   |
[Tampilkan Ringkasan Dashboard]
   |
[Selesai]
```

### 6.4 Alur Laporan Audit Stok (Stock Opname)
```
[Mulai]
   |
[Filter Periode Audit (Harian/Mingguan/Bulanan)]
   |
[Ambil data stock_opnames]
   |
[Hitung total selisih (Loss/Gain)]
   |
[Tampilkan Ringkasan Audit Stok]
   |
[Selesai]
```

---

## 7. Struktur Database (ERD – Teks)

```
PRODUCTS ──< SALES_ITEMS >── SALES
   |
   v
RECIPES ──< RECIPE_DETAILS >── RAW_MATERIALS
                                   |
                                   v
                            STOCK_MOVEMENTS

BMS_DEVICES ──< BMS_LOGS
```

---

## 8. Struktur Tabel Database

### products
- id (PK)
- name
- price
- is_active
- created_at

### raw_materials
- id (PK)
- name
- unit (gram/ml/pcs)
- stock
- min_stock
- created_at

### recipes
- id (PK)
- product_id (FK)

### recipe_details
- id (PK)
- recipe_id (FK)
- raw_material_id (FK)
- qty

### sales
- id (PK)
- invoice_number
- total
- payment_method
- created_at

### sales_items
- id (PK)
- sales_id (FK)
- product_id (FK)
- qty
- price

### stock_movements
- id (PK)
- raw_material_id (FK)
- type (IN / OUT / ADJUST)
- qty
- reference_id
- note
- created_at

### stock_opnames
- id (PK)
- raw_material_id (FK)
- system_stock
- physical_stock
- difference
- note
- created_at

### bms_devices
- id (PK)
- name
- type (SENSOR / ACTUATOR)
- category (ELECTRIC / HVAC / WATER / LIGHTING)
- unit
- current_value
- is_active
- last_update
- created_at

### bms_logs
- id (PK)
- device_id (FK)
- value
- created_at

---

## 9. Printer Kasir & Hardware

- Printer thermal ESC/POS
- USB / LAN / Bluetooth
- Library Node.js: node-thermal-printer

Alur:
```
Node.js → ESC/POS Command → Printer
```

---

## 10. Pengembangan Lanjutan (Future)

- Multi outlet (outlet_id)
- Role user (kasir / admin)
- Notifikasi stok minimum
- Integrasi Building Management System (BMS) - DONE
- Real-time IoT Monitoring via ESP32 - DONE
- Dashboard laporan grafis
- Integrasi cloud database

---

## 11. Kesimpulan

Kombinasi **Node.js + MySQL** sangat cocok untuk sistem kasir kedai kopi:
- Stabil
- Aman secara data
- Mudah dikembangkan
- Siap skala bisnis

Dokumen ini dapat dijadikan:
- Dokumentasi teknis
- Blueprint pengembangan
- Dasar implementasi kode
