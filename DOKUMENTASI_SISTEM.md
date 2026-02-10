# DOKUMENTASI SISTEM G-COFFEE POS v2.4
**Sistem Kasir Kedai Kopi Terintegrasi Stok Bahan Baku (BOM), Thermal Printer, & IoT BMS**

---

## 1. PENDAHULUAN
G-Coffee POS v2.4 adalah aplikasi Point of Sale (POS) modern yang dirancang khusus untuk operasional kedai kopi. Versi terbaru ini mengintegrasikan **Penjualan**, **Manajemen Stok Otomatis (BOM)**, **Pencetakan Struk Thermal**, dan **Building Management System (BMS)** berbasis IoT. Versi 2.4 menyertakan dukungan **Full Offline Icons**, **Pencarian Produk**, dan **Update Menu Februari 2026**.

## 2. TEKNOLOGI YANG DIGUNAKAN
- **Backend**: Node.js & Express.js
- **Database**: MySQL 8.0+ (InnoDB Engine)
- **Frontend**: Vanilla HTML5, CSS3, & JavaScript (Single Page Application)
- **Icons**: Lucide Icons
- **Hardware Integration**:
    - **Thermal Printer**: ESC/POS via `node-thermal-printer`
    - **IoT**: ESP32 (Wireless Telemetry & Control)

## 3. STRUKTUR PROYEK
```text
GCOFFEE_POSv2/
├── public/                 # File Frontend (Statis)
│   ├── css/style.css       # Desain Modern & Responsif
│   ├── js/script.js        # Logika Frontend & Interaksi API
│   └── index.html          # Struktur Utama Dashboard
├── src/                    # Backend Source Code
│   ├── controllers/        # Logika Request & Response (Sales, Product, Stock, BMS)
│   ├── database/           # Konfigurasi Koneksi MySQL
│   ├── routes/             # Definisi Endpoint API
│   └── services/           # Logika Bisnis Utama (Printer, BOM, BMS, Sales)
├── esp32_bms.ino           # Firmware ESP32 (Arduino IDE)
├── database.sql            # Skema Database & Tabel Utama
├── .env                    # Konfigurasi Database & Port
├── jalankan_server.bat     # Menjalankan aplikasi
├── seed_variants.js        # Script otomatisasi varian Panas/Dingin (v2.3)
└── package.json            # Daftar dependensi utama
```

## 4. FITUR UNGGULAN (PEMBARUAN v2.3)

### A. Point of Sale (POS) & Billing
- **Otomatisasi Varian**: Semua minuman kini memiliki opsi Panas/Dingin yang memicu pengurangan stok cup berbeda (Kertas vs Plastik).
- **Cetak Struk Thermal**: Integrasi langsung dengan printer thermal. Terdapat checkbox opsi cetak pada saat checkout.
- **Cetak Ulang (Reprint)**: Fitur baru di halaman laporan untuk mencetak ulang struk jika terjadi kegagalan hardware di awal.

### B. Building Management System (BMS) & IoT
- **Real-time Monitoring**: Dashboard menampilkan data dari ESP32 (Listrik, Suhu, Air).
- **Smart Control**: Kontrol relay (Lampu/AC) langsung dari aplikasi kasir yang akan dieksekusi oleh ESP32 secara wireless.
- **Telemetry System**: ESP32 secara otomatis mengirimkan data sensor ke server setiap 5 detik.

### C. Manajemen Stok & BOM
- **Dinamis BOM**: Pengurangan bahan baku otomatis mencakup packaging sesuai dengan suhu minuman yang dipilih pelanggan. Update v2.4 mencakup takaran resep otomatis untuk Creamer (12g) dan SKM (25g).
- **Audit Stok (Shift-Aware)**: Sistem laporan opname yang cerdas mengikuti jam operasional (06:00 - 03:00) untuk memantau selisih stok secara akurat bahkan saat dini hari.
- **February Menu Update**: Penambahan 18 menu baru seperti Pandan Latte, Butterscotch, dan Squash series dengan dukungan varian suhu.

---

## 5. ALUR KERJA SISTEM (USE CASE)

### 1. Proses Penjualan
1. Kasir memilih menu -> Pilih Suhu (Panas/Dingin) -> Masuk Keranjang.
2. Masukkan Nama Pelanggan & Pilih Metode Bayar.
3. Klik **Proses Pembayaran** (Pastikan opsi cetak centang jika ingin struk fisik).
4. Stok terpotong -> Invoice tersimpan -> Printer mencetak struk.

### 2. Monitoring & Kontrol Gedung
1. Buka tab **BMS** (Ikon Gedung).
2. Lihat grafik/angka suhu dan beban listrik.
3. Gunakan tombol ON/OFF untuk mengontrol lampu indoor/outdoor. ESP32 akan menerima perintah dalam siklus polling berikutnya.

---

## 6. PANDUAN INSTALASI & MAINTENANCE
1. **Instalasi**: Jalankan `npm install` untuk mengunduh library termasuk `node-thermal-printer`.
2. **Setup Printer**: Buka `src/services/printer.service.js` dan sesuaikan nama printer pada bagian `interface: 'printer:Nama_Printer_Anda'`.
3. **Setup ESP32**:
    *   Buka `esp32_bms.ino` di Arduino IDE.
    *   Masukkan SSID & Password WiFi.
    *   Ganti `serverUrl` dengan IP Laptop Anda.
    *   Upload ke ESP32.
4. **Maintenance Menu**: Jalankan `node seed_variants.js` setiap kali ada penambahan menu minuman baru untuk membuat varian suhunya secara otomatis.

---
*Dokumentasi Sistem G-Coffee POS v2.4 | Update: 10 Februari 2026*
