# Panduan Langkah Aktivasi Perangkat G-Coffee POS

Dokumen ini berisi petunjuk langkah demi langkah untuk mengaktifkan aplikasi POS, baik dari sisi **Klien (Kasir)** maupun dari sisi **Anda (Developer)**.

---

## 1. PETUNJUK UNTUK KLIEN (Sisi Komputer Kasir)

Ikuti langkah-langkah di bawah ini untuk melakukan aktivasi perangkat:

1. **Jalankan Aplikasi POS** di PC kasir Anda.
2. Anda akan melihat layar kunci bertuliskan **"Aktivasi Perangkat Diperlukan"** karena PC ini belum terdaftar.
3. Di layar tersebut, Anda akan melihat **Request Code** unik berupa deretan karakter (contoh: `YWM3-ZTZK-NTDK-ZWMW`).
4. Klik tombol **SALIN** di samping Request Code tersebut.
5. **Kirimkan Request Code** yang sudah disalin tersebut ke pihak Developer (melalui WhatsApp/Email).
6. Tunggu hingga Developer mengirimkan kembali **Activation Code** unik Anda.
7. Setelah menerima **Activation Code** (contoh: `6EA8-4FFA-E9B0-3426`), masukkan kode tersebut ke dalam kolom input yang tersedia di layar.
8. Klik tombol **AKTIFKAN APLIKASI**.
9. Halaman akan otomatis memuat ulang (*reload*) dan sistem POS siap digunakan sepenuhnya secara offline.

---

## 2. PETUNJUK UNTUK DEVELOPER (Cara Membuat Activation Code)

Saat klien mengirimkan **Request Code** kepada Anda, ikuti langkah berikut untuk membuat kuncinya:

1. Buka **Command Prompt (CMD)** atau **PowerShell** di folder project POS Anda.
2. Jalankan perintah berikut dengan menyertakan Request Code dari klien:
   ```bash
   node generate_license.js <REQUEST-CODE>
   ```
   *Contoh:*
   ```bash
   node generate_license.js YWM3-ZTZK-NTDK-ZWMW
   ```
3. Tekan Enter. Script akan menghasilkan output seperti di bawah ini:
   ```text
   =========================================
   Request Code:    YWM3-ZTZK-NTDK-ZWMW
   Activation Code: 6EA8-4FFA-E9B0-3426
   =========================================
   ```
4. Salin **Activation Code** (`6EA8-4FFA-E9B0-3426`) tersebut dan kirimkan kembali kepada klien Anda.
