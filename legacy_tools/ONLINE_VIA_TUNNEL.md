# Panduan Online-kan POS via Cloudflare Tunnel (GRATIS)

Metode ini membuat PC/Laptop toko Anda bisa diakses dari internet secara aman dan gratis tanpa perlu hosting cloud atau IP Publik Statis.

## 1. Persiapan File
Anda sudah memiliki file `cloudflared-windows-amd64.exe` di dalam folder `legacy_tools/`. Kita akan menggunakan file tersebut untuk setup.

---

## 2. Metode Cepat (Uji Coba / URL Berubah-ubah)
Gunakan cara ini jika hanya ingin ngetes sebentar. URL akan berubah setiap kali Anda menutup CMD.

1.  Buka **Command Prompt (CMD)** di folder project ini.
2.  Ketik perintah:
    ```bash
    .\legacy_tools\cloudflared-windows-amd64.exe tunnel --url http://localhost:3000
    ```
3.  Cari tulisan yang mirip seperti ini:
    `+  https://random-word-xyz.trycloudflare.com`
4.  Buka link tersebut di HP/Gadget lain.

---

## 3. Metode Permanen (Rekomendasi - Menggunakan Domain Sendiri)
Metode ini tetap jalan meskipun PC restart, karena Cloudflare akan berjalan sebagai **Windows Service**.

### Langkah A: Setting di Dashboard Cloudflare
1.  Buka [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/).
2.  Masuk ke menu **Networks** -> **Tunnels**.
3.  Klik **Create a Tunnel**.
4.  Pilih **Cloudflared**, beri nama (misal: `POS-Coffee-Toko`), lalu Save.
5.  Di bagian **Install and run a connector**, pilih tab **Windows** -> **64-bit**.
6.  Anda akan melihat perintah panjang yang berisi token. Contohnya:
    `cloudflared.exe service install eyJhIjoi... (token panjang)`
7.  **Salin (Copy) hanya bagian token-nya saja** (string panjang setelah kata `install`).

### Langkah B: Instalasi di Windows Service
1.  Buka **Command Prompt (CMD)** sebagai **Administrator**.
2.  Masuk ke direktori project Anda:
    ```cmd
    d:
    cd "Produk INsalusi\POS\gcoffee-pos-v2"
    ```
3.  Jalankan perintah instalasi service (Ganti `[TOKEN_ANDA]` dengan token yang dicopy tadi):
    ```cmd
    .\legacy_tools\cloudflared-windows-amd64.exe service install [TOKEN_ANDA]
    ```
4.  Buka **Services.msc** di Windows, cari service bernama **Cloudflared**, pastikan statusnya **Running**.

### Langkah C: Menghubungkan Domain
1.  Kembali ke Dashboard Cloudflare (halaman tadi).
2.  Klik **Next** untuk masuk ke tab **Public Hostname**.
3.  Isi data berikut:
    - **Subdomain**: (misal: `pos`)
    - **Domain**: (pilih domain Anda, misal: `gcoffee.com`)
    - **Type**: `HTTP`
    - **URL**: `localhost:3000`
4.  Klik **Save Tunnel**.
5.  Selesai! Sekarang POS Anda bisa diakses selamanya di `https://pos.gcoffee.com`.

---

## FAQ & Tips
- **Printer Struk**: Tetap berjalan lancar karena file server dan driver printer tetap ada di PC lokal.
- **Keamanan**: Hanya orang yang tahu link Anda yang bisa akses. Cloudflare juga membentengi dari serangan DDOS.
- **Restart PC**: Tunnel akan otomatis menyala sendiri saat PC dihidupkan tanpa harus buka CMD.

---
*Dokumentasi diperbarui berdasarkan persetujuan konfigurasi terakhir menggunakan jalur Cloudflared.*
