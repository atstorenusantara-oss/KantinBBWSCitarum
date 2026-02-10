# Analisa Teknologi & Database - v2.4
## Sistem Kasir Kedai Kopi Terintegrasi Stok Bahan Baku & IoT BMS
Teknologi: **Node.js + MySQL + ESP32**

---

## 1. Gambaran Umum Sistem

Sistem ini adalah **Point of Sale (POS)** untuk kedai kopi yang terhubung langsung dengan **manajemen stok bahan baku berbasis resep (BOM)** dan **Building Management System (BMS)**.
Setiap penjualan akan otomatis mengurangi stok bahan sesuai takaran resep, termasuk otomatisasi pemilihan jenis packaging (Cup) berdasarkan suhu minuman.

---

## 2. Arsitektur Sistem (Update v2.3)

```
[Frontend Kasir & Dashbaord]
(Vanilla JS / Tablet / PC)
         |
         v
[Backend API - Node.js] <--- (Polling/Telemetry) ---> [ESP32 / IoT Devices]
(Express.js)                                          (Sensors & Relays)
         |          |
         v          v
[MySQL DB]   [Printer Kasir Thermal]
             (ESC/POS Support)
```

---

## 3. Analisa Teknologi Backend

### 3.1 Stack Backend Terbaru
- **Core**: Node.js v18+ & Express.js
- **Database**: mysql2 (Transaction-safe)
- **Printing**: `node-thermal-printer` (Direct ESC/POS)
- **Utilities**: uuid, dayjs, dotenv, cors

### 3.2 Struktur Folder (Actual)
```
src/
 ├─ app.js
 ├─ routes/ (Sales, Product, Stock, BMS, Report)
 ├─ controllers/
 ├─ services/
 ├─ database/
 └─ utils/
seed_february.js           (February 2026 Menu Update) - NEW
update_recipes_february.js (Creamer & UHT Engine) - NEW
update_recipes_skm.js      (SKM logic) - NEW
public/js/lucide.min.js    (Offline Icon Library) - NEW
```

---

## 4. Alur Transaksi & Logika Varian (Critical Logic)

### 4.1 Logika Varian & Packaging (v2.3)
Sistem sekarang menggunakan script `seed_variants.js` yang dinamis untuk menciptakan varian suhu:
- **Trigger**: Kasir klik produk dasar (Contoh: Americano).
- **Opsi**: Modal muncul menanyakan "Panas" atau "Dingin".
- **BOM Mapping**:
    - **Panas** -> Menambahkan detail resep **Cup Kertas**.
    - **Dingin** -> Menambahkan detail resep **Cup Plastik**.

### 4.2 Alur Penjualan dengan Printer
```
BEGIN TRANSACTION
  INSERT sales (and check should_print flag)
  INSERT sales_items
  UPDATE raw_materials.stock (Otomatis potong Packaging)
  INSERT stock_movements
COMMIT
  IF should_print: CALL PrinterService.printReceipt()
  IF Failed: User can manually REPRINT from Report Page
```

---

## 5. Analisa IoT & BMS (ESP32)

### 5.1 Telemetry (Sensor)
ESP32 mengirimkan data via `POST /api/bms/telemetry` secara berkala (5 detik).
Data yang didukung: Suhu, Beban Listrik (Watts), Level Air.

### 5.2 Control (Actuator/Relay)
ESP32 melakukan polling via `GET /api/bms/status?name=...`. Jika status di database berubah menjadi `ON` (via Dashboard), ESP32 akan mengaktifkan relay fisik pada GPIO yang ditentukan.

---

## 6. Struktur Database (Schema Update)

### bms_devices
- id, name, type (SENSOR/ACTUATOR), category, unit, current_value, is_active.

### sales (v2.3)
- payment_status (PAID/PENDING) -> Mendukung fitur piutang.

### raw_materials
- packaging items (Cup Kertas, Cup Plastik) sudah masuk ke dalam sistem monitoring kritis.

---

## 7. Printer Kasir & Hardware Integration

- **Library**: node-thermal-printer.
- **Support**: ESC/POS Standard.
- **Fitur Baru**:
    - Checkbox "Cetak Otomatis" di keranjang.
    - Fungsi **Reprint** untuk mencetak ulang transaksi lama dari tabel riwayat.

---

## 8. Kesimpulan & Blueprint Future

Sistem v2.3 telah mencapai tingkat maturitas yang tinggi dengan integrasi hardware (Printer & IoT). Pengembangan selanjutnya dapat difokuskan pada:
- Dashbaord laporan grafis (Chart.js).
- Multi-outlet support dengan `outlet_id`.
- Notifikasi WhatsApp untuk pengingat stok kritis.

---
*Dokumen diperbarui: 7 Februari 2026 sebagai Blueprint Dasar Pengembangan.*
