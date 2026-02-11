# Analisa Teknologi & Database - v2.5
## Sistem Kasir Kedai Kopi Terintegrasi Stok Bahan Baku & IoT BMS
Teknologi: **Node.js + MySQL + ESP32**

---

## 1. Gambaran Umum Sistem

Sistem ini adalah **Point of Sale (POS)** untuk kedai kopi yang terhubung langsung dengan **manajemen stok bahan baku berbasis resep (BOM)** dan **Building Management System (BMS)**.
Setiap penjualan akan otomatis mengurangi stok bahan sesuai takaran resep, termasuk otomatisasi pemilihan jenis packaging (Cup) berdasarkan suhu minuman.

---

## 2. Arsitektur Sistem (Update v2.5)

```
[Frontend Kasir & Dashboard] <--- [Chrome Kiosk Mode]
(Vanilla JS / Tablet / PC)
         |
         v
[Backend API - Node.js] <--- (Polling/Telemetry) ---> [ESP32 / IoT Devices]
(Express.js)                                          (Sensors & Relays)
         |          |
         v          v
[MySQL DB]   [Printer Kasir Thermal]
              (ESC/POS Support via PowerShell Spooler)
```

---

## 3. Analisa Teknologi Backend

### 3.1 Stack Backend Terbaru
- **Core**: Node.js v18+ & Express.js
- **Database**: mysql2 (Transaction-safe)
- **Printing**: `node-thermal-printer` & PowerShell Raw Printing (Spooler API)
- **Utilities**: uuid, dayjs, dotenv, cors, **child_process** (untuk kontrol sistem/shutdown)

### 3.2 Struktur Folder & File Utama
```
GCOFFEE_POSv2/
 ├─ jalankan_pos_otomatis.bat   (Launcher: Cek Server + Kiosk Chrome) - NEW
 ├─ aktifkan_autorun.bat        (Setup Startup Windows) - NEW
 ├─ print_raw.ps1               (PowerShell Spooler API)
 ├─ src/
 │   ├─ app.js                  (Entry Point & Route Registration)
 │   ├─ routes/                 (System, Sales, Product, Stock, BMS, Report, Auth)
 │   ├─ controllers/
 │   ├─ services/               (Printer Service with .env config)
 │   ├─ database/
 │   └─ utils/
 ├─ public/
 │   ├─ index.html              (UI Utama dengan Sidebar & Modal)
 │   ├─ css/style.css           (Desain Modern + Tablet Optimized Keyboard)
 │   └─ js/script.js            (Logic Frontend & VK v2)
 └─ .env                        (Config: DB, Port, PRINTER_NAME)
```

---

## 4. Alur Transaksi & Logika Varian

### 4.1 Logika Varian & Packaging (v2.3)
Sistem menggunakan script `seed_variants.js` yang dinamis:
- **Panas** -> Menambahkan detail resep **Cup Kertas**.
- **Dingin** -> Menambahkan detail resep **Cup Plastik**.

### 4.2 Alur Penjualan dengan Printer (v2.5)
1. **Transaction Start**: Simpan data ke MySQL.
2. **Buffer Generation**: `PrinterService` membuat buffer ESC/POS.
3. **Hardware Selection**: Nama printer diambil dari `.env` (`PRINTER_NAME`).
4. **Execution**: Node.js memanggil PowerShell `print_raw.ps1` untuk mengirim data mentah ke spooler Windows (paling stabil).

---

## 5. Fitur Khusus Tablet (Pembaruan v2.5)

### 5.1 Keyboard Virtual v2 (Optimized)
- Layout **5 Kolom** (Baris 1: [1-5], Baris 2: [6-0], Baris 3: [.][DEL][SELESAI]).
- Dimensi lebih lebar dan pendek agar tangan mudah menjangkau semua area tanpa menutupi input text.
- Deteksi otomatis: Numerik muncul untuk PIN/Qty, QWERTY untuk Nama/Search.

### 5.2 Kiosk Mode & Autorun
- `jalankan_pos_otomatis.bat` memastikan server aktif sebelum membuka Chrome.
- Chrome dijalankan dengan flag `--kiosk` dan `--user-data-dir` untuk tampilan aplikasi penuh tanpa gangguan.

### 5.3 System Control
- Endpoint `/api/system/shutdown` memungkinkan kasir mematikan tablet langsung dari aplikasi melalui dual-confirmation dialog.

---

## 6. Analisa IoT & BMS (ESP32)

- **Telemetry**: GET/POST data setiap 5 detik.
- **Control**: Polling status relay via Dashboard.

---

*Dokumen diperbarui: 11 Februari 2026 | Antigravity AI Assistant.*
