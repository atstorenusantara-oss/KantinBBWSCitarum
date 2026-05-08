# Panduan Migrasi Cloud Hosting - G-Coffee POS v2

Dokumen ini berisi langkah-langkah untuk menghosting sistem POS Anda ke Cloud (misal: Railway, Render, atau VPS Linux).

## 1. Persiapan Database (Ekspor)
Karena Anda akan pindah ke server online, Anda perlu memindahkan data dari laptop ke cloud database.
Jalankan perintah ini di Command Prompt/Terminal laptop Anda:
```bash
mysqldump -u root -p gcoffee_pos > backup_data.sql
```

## 2. Pilihan Hosting Komplit (Satu Paket)
Saya merekomendasikan **Railway.app** karena paling mudah untuk Node.js + MySQL.
1. Buat akun di [Railway.app](https://railway.app).
2. Pilih **New Project** -> **Provision MySQL**.
3. Pilih **New Project** -> **Deploy from GitHub repo** (Hubungkan repo POS Anda).
4. Di bagian **Variables**, masukkan isi dari `.env` Anda:
   - `PORT`: 3000
   - `DB_HOST`: (Ambil dari tab MySQL di Railway)
   - `DB_USER`: (Ambil dari tab MySQL di Railway)
   - `DB_PASS`: (Ambil dari tab MySQL di Railway)
   - `DB_NAME`: (Ambil dari tab MySQL di Railway)
   - `PRINTER_NAME`: Skip (Cetak fisik tidak jalan di Cloud)

## 3. Penyesuaian Fitur (Cloud Mode)
Beberapa fitur telah disesuaikan secara otomatis untuk mendeteksi jika aplikasi berjalan di Cloud (OS Linux):

| Fitur | Perilaku di Cloud |
| :--- | :--- |
| **Printer Struk** | Tombol cetak di dashboard akan dialihkan ke **Cetak via Browser**. Anda tetap bisa print ke printer thermal menggunakan fitur "Browser Print" (Ctrl+P). |
| **Shutdown** | Fitur Mematikan Tablet dinonaktifkan (karena server ada di internet, bukan di tablet). |
| **IoT ESP32** | Anda perlu mengganti IP Address di kode ESP32 ke URL hosting baru Anda (misal: `pos-gcoffee.up.railway.app`). |

## 4. Keuntungan Hosting di Cloud
1. **Multi-User**: Owner bisa cek laporan dari rumah, kasir input dari toko, stokis update dari gudang secara real-time.
2. **Keamanan Data**: Data tersimpan di server profesional, aman dari kerusakan laptop toko.
3. **Tanpa Setup IP**: Tidak perlu ribet dengan IP publik atau port forwarding.

---
*Langkah selanjutnya: Silakan upload kode ini ke GitHub untuk memulai deployment.*
