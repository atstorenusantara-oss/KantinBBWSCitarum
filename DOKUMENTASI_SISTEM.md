# DOKUMENTASI SISTEM G-COFFEE POS v2.2
**Sistem Kasir Kedai Kopi Terintegrasi Stok Bahan Baku (BOM)**

---

## 1. PENDAHULUAN
G-Coffee POS v2 adalah aplikasi Point of Sale (POS) modern yang dirancang khusus untuk operasional kedai kopi. Fitur unggulan sistem ini adalah integrasi real-time antara **Penjualan** dan **Manajemen Stok Bahan Baku** menggunakan metode *Bill of Materials* (BOM).

## 2. TEKNOLOGI YANG DIGUNAKAN
- **Backend**: Node.js & Express.js
- **Database**: MySQL 8.0+
- **Frontend**: Vanilla HTML5, CSS3, & JavaScript (Single Page Application)
- **Icons**: Lucide Icons
- **Date Handling**: Day.js

## 3. STRUKTUR PROYEK
```text
GCOFFEE_POSv2/
├── public/                 # File Frontend (Statis)
│   ├── css/style.css       # Desain Modern & Responsif
│   ├── js/script.js        # Logika Frontend & Interaksi API
│   └── index.html          # Struktur Utama Dashboard
├── src/                    # Backend Source Code
│   ├── controllers/        # Logika Request & Response (Sales, Product, Stock)
│   ├── database/           # Konfigurasi Koneksi MySQL
│   ├── routes/             # Definisi Endpoint API
│   └── services/           # Logika Bisnis Utama (BOM, Report, Sales)
├── database.sql            # Skema Database & Tabel Utama
├── .env                    # Konfigurasi Port, User, & Password Database
├── jalankan_server.bat     # Menjalankan aplikasi (NPM Start)
├── matikan_server.bat      # Menghentikan paksa semua proses node (Taskkill)
├── seed_recipes.js         # Script pengisian resep standar (BOM)
├── seed_variants.js        # Script pembuatan varian Hot/Cold otomatis
├── seed_images.js          # Script integrasi gambar produk dari URL luar
├── seed_new_materials.js   # Script penambahan bahan baku baru (Packaging)
├── set_local_images.js     # Script konfigurasi path gambar lokal
├── update_categories.js    # Script pembaruan kategori menu (Espresso, Snack, dll)
└── package.json            # Daftar dependensi utama aplikasi
```

## 4. FITUR UTAMA SISTEM (PEMBARUAN v2.2)

### A. Point of Sale (POS) & Billing
- **Varian Produk**: Mendukung pilihan varian (contoh: Hot/Cold) dengan penyesuaian harga otomatis.
- **Pilihan Suhu**: Modal otomatis muncul saat memilih minuman untuk menentukan suhu (Cup Kertas untuk Panas, Cup Plastik untuk Dingin).
- **Status Pembayaran**:
    - **Bayar Sekarang (PAID)**: Transaksi langsung lunas dan masuk ke laporan pendapatan.
    - **Bayar Nanti (PENDING)**: Fitur *Open Tab* atau Piutang. Stok terpotong namun uang belum masuk ke laporan pendapatan sampai dilunasi.

### B. Manajemen Pesanan Pending (Piutang)
- Halaman khusus untuk memantau pelanggan yang belum bayar (ikon 🕒).
- Daftar menu detail per pelanggan yang masih menggantung.
- Fitur pelunasan cepat dengan pilihan metode **Cash** atau **QRIS**.
- Pencarian piutang berdasarkan nama pelanggan.

### C. Manajemen Stok & BOM (Bill of Materials)
- **Otomatisasi Stok**: Penjualan produk otomatis mengurangi bahan baku (termasuk packaging seperti Cup dan Sedotan).
- **Monitoring Packaging**: Laporan harian secara otomatis memantau stok kritis bahan habis pakai (packaging).

### D. Sistem Laporan Multi-Shift Fleksibel
- **Dua Shift Operasional**:
    - **Shift Pagi**: 06:00 - 17:00 (Konfigurasi DB)
    - **Shift Malam**: 17:00 - 03:00 (Konfigurasi DB)
- **Rincian Pembayaran**: Laporan menampilkan breakdown pendapatan antara **Tunai (Cash)** dan **QRIS**.
- **Foto Laporan (Print Preview)**: Fitur pratinjau laporan harian untuk difoto oleh karyawan, mencakup:
    - Total Omzet Lunas Per Shift.
    - Top 3 Produk Terlaris.
    - Pantauan Stok Bahan & Packaging.
    - **Catatan Piutang**: Daftar pelanggan yang belum bayar pada shift tersebut.

### E. Building Management System (BMS) & IoT
- **Real-time Monitoring**: Pemantauan daya listrik (Watts), suhu ruangan (°C), dan level air toren secara langsung.
- **Smart Control**: Kontrol lampu indoor/outdoor dan AC langsung dari dashboard kasir.
- **ESP32 Integration**: API siap pakai untuk integrasi mikrokontroler ESP32 via protokol HTTP POST/GET.
- **Health System**: Monitoring status koneksi perangkat IoT (Active/Offline).

## 5. ALUR KERJA SISTEM (USE CASE)

### 1. Proses Penjualan & Piutang
1. User memilih menu -> Pilih Varian (Hot/Cold) -> Klik Keranjang.
2. Masukkan Nama Pelanggan.
3. Pilih status: **Bayar Sekarang** atau **Bayar Nanti**.
4. Jika **Bayar Nanti**: Pesanan tersimpan di menu 🕒 (Pending).
5. Jika Pelanggan mau bayar: Kasir buka menu Pending -> Pilih Nama -> Klik Bayar Tunai/QRIS.

### 2. Monitoring Omzet & Shift
1. User masuk ke tab Laporan.
2. Pilih Tanggal dan **Shift** (Pagi/Malam) yang ingin dilihat.
3. Omzet yang muncul hanya transaksi yang sudah **PAID**.
4. Klik "Pratinjau Laporan" untuk mengirim laporan ringkas ke Owner.

### 3. Monitoring Gedung (BMS)
1. User masuk ke tab Ikon Gedung (BMS).
2. Lihat indikator suhu, listrik, dan air.
3. Klik tombol ON/OFF untuk mengontrol lampu/AC di lokasi.
4. Perangkat IoT (ESP32) akan melakukan sinkronisasi otomatis dengan server.

## 6. RESPONSIVITAS PERANGKAT
Sistem ini telah dioptimalkan untuk perangkat **Tablet (Tab)**:
- **Tablet Landscape**: Sidebar samping untuk efisiensi.
- **Tablet Portrait / Handheld**: Sidebar berpindah ke atas (sticky) dan keranjang belanja berpindah ke bawah.

## 7. CARA INSTALASI & SETTING
1. **Database**: Import file `database.sql` ke MySQL Anda.
2. **Konfigurasi Shift**: Sesuaikan jam operasional di tabel `settings`.
3. **Dependensi**: Jalankan `npm install`.
4. **Resep Standar**: Jalankan `node seed_recipes.js`.
5. **Varian Produk**: Jalankan `node seed_variants.js`.
6. **Menjalankan**: Klik dua kali file `jalankan_server.bat`.

---
*Dokumentasi ini diperbarui pada 6 Februari 2026 sebagai panduan teknis operasional G-Coffee POS v2.2.*
