# DOKUMENTASI SISTEM G-COFFEE POS v2.5
**Sistem Kasir Kedai Kopi Terintegrasi Stok Bahan Baku (BOM), Thermal Printer, & IoT BMS**

---

## 1. PENDAHULUAN
G-Coffee POS v2.5 adalah solusi kasir modern yang dirancang untuk Tablet/PC Windows. Mengintegrasikan manajemen penjualan, pemotongan stok bahan baku (resep) secara otomatis, monitoring gedung (BMS), dan kemudahan operasional tablet melalui Kiosk Mode.

---

## 2. TEKNOLOGI UTAMA
- **Backend**: Node.js & Express.js.
- **Database**: MySQL 8.0+.
- **Frontend**: Single Page Application (Vanilla HTML/CSS/JS).
- **Hardware Integration**:
    - **Printer**: RONGTA 58mm / ESC-POS (via PowerShell Spooler API).
    - **IoT**: ESP32 (Wireless Telemetry).
    - **OS**: Windows (dengan integrasi Batch Script).

---

## 3. STRUKTUR PROYEK & FILE PENTING
```text
GCOFFEE_POSv2/
├── jalankan_pos_otomatis.bat  # Launcher cerdas (Cek server lalu buka Kiosk Chrome)
├── aktifkan_autorun.bat       # Script untuk mendaftarkan program ke Startup Windows
├── .env                       # Konfigurasi Database & Nama Printer
├── public/                    # Frontend (UI/UX)
│   ├── js/script.js           # Logika Utama & Keyboard Virtual v2
│   └── index.html             # Struktur Dashboard Kasir
└── src/                       # Backend (API & Logika Bisnis)
    ├── services/              # BOM Logic & Printer Service
    └── routes/                # API Endpoints (inc. System Shutdown)
```

---

## 4. FITUR UNGGULAN v2.5 (TERBARU)

### A. Tablet Optimization & Accessibility
- **Virtual Keyboard v2**: Keyboard numerik lebar (5 kolom) yang dirancang khusus untuk layar sentuh tablet agar presisi tekan tombol lebih tinggi.
- **Dual Keyboard Mode**: Secara cerdas berganti antara Numerik (untuk PIN/Stok) dan QWERTY (untuk Nama/Cari).

### B. Integrated Kiosk Mode
- Sistem dirancang untuk berjalan sebagai aplikasi mandiri.
- **Auto-Launcher**: Memastikan database dan server Node.js aktif terlebih dahulu sebelum membuka antarmuka kasir.
- **Kiosk Mode**: Chrome berjalan tanpa toolbar dan tombol sistem, mengunci tablet hanya untuk aplikasi kasir.

### C. System Management & Security
- **Remote Shutdown**: Fitur mematikan tablet langsung dari sidebar aplikasi (Menu Sistem) dengan konfirmasi ganda (Double Confirm) untuk keamanan.
- **Print via Spooler**: Menggunakan PowerShell API (`print_raw.ps1`) untuk menjamin struk terdeteksi di Windows tanpa driver khusus pihak ketiga.

### D. Manajemen Stok & Audit
- **Automatic BOM**: Potong stok bahan & packaging (Cup) sesuai suhu minuman (Panas/Dingin).
- **AI Smart Audit**: Fitur analisa anomali yang mendeteksi kecurangan atau selisih stok secara otomatis.

### E. Akses Jarak Jauh (Remote Monitoring)
- **Cloudflare Tunnel**: Memungkinkan owner memonitor dashboard kasir dari mana saja (lewat HP/Laptop luar toko) secara GRATIS dan AMAN tanpa IP Publik.
- Lihat panduan lengkap di: `ONLINE_VIA_TUNNEL.md`.

---

## 5. PANDUAN INSTALASI (KOMPUTER BARU)
1. **Salin Folder**: Copy seluruh folder project ke PC target.
2. **Install Dependensi**: Jalankan `npm install` (Butuh Node.js).
3. **Setup Database**: Buat DB `gcoffee_pos` di MySQL dan import `database.sql`.
4. **Konfigurasi Printer**: Buka `.env` dan isi `PRINTER_NAME` sesuai nama di Windows.
5. **Aktifkan Autorun**: Jalankan **`aktifkan_autorun.bat`** sebagai Administrator.
6. **Selesai**: Restart komputer. Sistem akan otomatis masuk ke mode kasir layaknya mesin POS profesional.

---

*Dokumentasi Sistem G-Coffee POS v2.5 | Update: 11 Februari 2026*
