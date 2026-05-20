# Panduan Uji Coba, Kompilasi Bytecode, & Build EXE POS (Terupdate)

Dokumen ini memandu Anda melakukan pengetesan sistem lisensi secara lokal, mengompilasi kode penting menjadi V8 bytecode (`.jsc`), hingga mengemasnya menjadi file `.exe` mandiri untuk didistribusikan ke komputer klien tanpa perlu menginstal Node.js/npm.

---

## TAHAP 1: Uji Coba Lisensi Secara Lokal

1. **Jalankan Aplikasi** dalam mode development:
   ```bash
   npm run dev
   ```
2. **Buka Browser** di alamat `http://localhost:3000`.
3. Anda akan melihat **layar blokir gelap (Activation Screen)** yang menampilkan **Request Code** komputer Anda saat ini.
4. Klik tombol **SALIN** pada layar untuk menyalin Request Code tersebut.
5. Buka terminal/cmd baru di folder project POS Anda, lalu jalankan perintah generator lisensi:
   ```bash
   node generate_license.js <REQUEST-CODE-YANG-DISALIN>
   ```
   *Contoh:*
   ```bash
   node generate_license.js YWM3-ZTZK-NTDK-ZWMW
   ```
6. Generator akan menampilkan **Activation Code** unik (contoh: `6EA8-4FFA-E9B0-3426`).
7. Kembali ke browser, **masukkan Activation Code** tersebut ke kolom yang disediakan, lalu klik **AKTIFKAN APLIKASI**.
8. Aplikasi akan langsung memuat ulang halaman, kunci terbuka, dan sistem POS masuk ke halaman kasir utama. File `license.json` secara otomatis dibuat di root proyek Anda untuk menyimpan status aktivasi ini.

---

## TAHAP 2: Kompilasi ke V8 Bytecode (`.jsc`)

Untuk memastikan logic lisensi Anda tidak bisa dibaca/dihapus oleh pengguna, kita harus mengompilasi file `src/services/license.service.js` menjadi V8 bytecode:

1. Jalankan perintah kompilasi berikut di terminal:
   ```bash
   npm run build:bytecode
   ```
   *Perintah ini menghasilkan file biner baru bernama `src/services/license.service.jsc`.*
2. **[PENTING] Hapus atau pindahkan file asli `src/services/license.service.js`** ke folder backup di luar proyek Anda sebelum melakukan build `.exe`.
   * **Mengapa?** Jika file `.js` masih ada di folder `src/services/`, Node.js secara default memprioritaskannya dibanding file bytecode `.jsc`. File `.js` harus dihapus agar Node.js memuat file biner `.jsc` yang terenkripsi.

---

## TAHAP 3: Build Menjadi File `.exe` Mandiri

1. Sebelum build, pastikan server atau file `.exe` lama tidak sedang dijalankan di background (jika masih aktif, proses build akan mengalami error `EPERM`).
2. Jalankan perintah pembungkusan biner:
   ```bash
   npm run build:exe
   ```
   *Perintah ini akan membuat folder baru bernama `dist/` dan menghasilkan file `gcoffee-pos.exe` di dalamnya.*

---

## TAHAP 4: Distribusi & Menjalankan di PC Klien

Karena file UI (HTML, CSS, JS) di folder `public` sudah terbungkus secara otomatis di dalam `gcoffee-pos.exe` (melalui konfigurasi `"pkg"` di `package.json`), **Dimana Anda tidak perlu menyalin folder `public`** ke PC kasir klien secara manual.

### 1. Struktur Folder Rilis yang Harus Disalin:
Buat folder baru untuk klien dan cukup salin berkas berikut:
```text
📁 Folder Rilis POS/
├── 📄 gcoffee-pos.exe (Ambil dari folder dist/)
├── 📄 .env (File konfigurasi port, printer, database MySQL lokal klien)
├── 📄 jalankan_pos_otomatis.bat (Launcher otomatis untuk kasir)
└── 📄 migration_kantin.sql (Untuk import skema database MySQL pertama kali)
```

### 2. Cara Menjalankan di PC Klien:
1. Pastikan database MySQL sudah terinstal di PC klien dan skema database dari `migration_kantin.sql` sudah di-import.
2. Edit file `.env` di komputer klien untuk menyesuaikan password database (`DB_PASS`) dan nama printer kasir (`PRINTER_NAME`).
3. Kasir cukup melakukan **klik ganda pada `jalankan_pos_otomatis.bat`**.
4. Script batch akan otomatis menyalakan server dari `gcoffee-pos.exe` dan membuka Google Chrome dalam Mode Kiosk penuh mengarah ke port POS.
5. Saat dijalankan pertama kali, masukkan kode aktivasi yang dihasilkan melalui `generate_license.js` untuk membuka kunci PC tersebut secara permanen.
