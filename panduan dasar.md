# ☕ PANDUAN DASAR OPERASIONAL KASIR - G-COFFEE POS v2.5

Selamat datang di Sistem Kasir G-Coffee POS. Panduan ini akan membantu Anda memahami alur kerja dari login hingga penutupan shift.

---

## 1. MEMULAI SISTEM & LOGIN
1. **Autorun**: Saat tablet dinyalakan, sistem akan otomatis membuka layar kasir. Tunggu hingga logo "GC" muncul.
2. **Login**: 
    - Pilih nama Anda di daftar **"Pilih User"**.
    - Masukkan **4 Digit PIN** Anda menggunakan keyboard virtual yang muncul otomatis.
    - Klik **"Masuk Ke Sistem"**. Sistem akan mencatat waktu masuk Anda sebagai data absensi.

## 2. TRANSAKSI PENJUALAN (MENU KASIR)
Halaman ini adalah menu utama Anda untuk melayani pelanggan.
- **Cari Menu**: Gunakan bar pencarian di atas untuk mencari nama produk dengan cepat.
- **Kategori**: Filter menu berdasarkan jenis (Espresso, Milk Based, Snack, lll) untuk mempermudah navigasi.
- **Memasukkan Pesanan**:
    - Klik pada gambar/kartu produk.
    - **Pilih Varian**: Jika menu memiliki varian panas/dingin, kotak pilihan akan muncul. Pilih salah satu.
    - Menu akan masuk ke keranjang di sisi kanan.

## 3. MENGELOLA KERANJANG & PEMBAYARAN
- **Ubah Jumlah**: Klik tombol **(+)** atau **(-)** pada item di keranjang.
- **Void (Hapus Item)**: Jika Anda menekan **(-)** hingga item hilang (menjadi 0), sistem akan meminta konfirmasi alasan penghapusan (salah input, pelanggan batal, dll).
- **Nama Pelanggan**: Masukkan nama pelanggan (Opsional). Jika dikosongkan, sistem akan otomatis memakai nama Anda.
- **Status Pembayaran**:
    - **Bayar Sekarang (PAID)**: Untuk transaksi yang langsung lunas.
    - **Bayar Nanti (PENDING)**: Gunakan jika pelanggan ingin membayar belakangan (Open Bill).
- **Proses**: Klik **"Proses Pembayaran"**. Jika kotak "Cetak Struk" dicentang, printer thermal akan otomatis mencetak nota.

## 4. DAFTAR PESANAN PENDING (OPEN BILL)
Gunakan menu **Clock/Pending** (Icon Jam di sidebar) untuk mengelola tagihan yang belum lunas.
- **Pelunasan**: Klik tombol **"Tunai"** atau **"QRIS"** jika pelanggan sudah membayar.
- **Tambah Menu**: Klik **"Tambah Menu"** jika pelanggan ingin menambah pesanan pada bill yang sama. Anda akan diarahkan kembali ke menu kasir dalam mode "Update Bill".

## 5. MANAJEMEN STOK (STOK OPNAME)
Menu **Package** (Icon Dus di sidebar) digunakan untuk audit bahan baku setiap pergantian shift atau hari.
- Pilih bahan baku (misal: Biji Gayo, Cup 14oz).
- Masukkan **Stok Fisik Aktual** yang Anda hitung di lapangan.
- Isi catatan jika ada selisih (misal: "tumpah", "rusak"). Klik **"Simpan Opname"**.

## 6. LAPORAN & AUDIT (SHIFT)
Menu **Bar Chart** (Icon Grafik) menampilkan performa penjualan Anda.
- **Filter Shift**: Pastikan shift yang dipilih sesuai (Shift 1: 06-17, Shift 2: 17-03).
- **Print Laporan**: Klik **"Print Laporan"** untuk melihat ringkasan omzet, metode pembayaran, sisa stok kritis, dan AI Smart Audit (deteksi anomali).

## 7. KEYBOARD VIRTUAL (VIRTUAL KEYBOARD)
Sistem ini dilengkapi keyboard layar sentuh:
- **Mode Numerik**: Muncul otomatis untuk input angka (PIN, Jumlah Stok).
- **Mode QWERTY**: Muncul otomatis untuk input teks (Nama Pelanggan, Cari Menu).
- Klik tombol **"OK"** atau **"SELESAI"** jika sudah selesai mengetik.

## 8. INTEGRASI BMS (MONITORING GEDUNG)
Menu **Building** (Icon Bangunan) untuk memantau keadaan kedai:
- Cek suhu area Bar (pastikan tetap sejuk untuk mesin kopi).
- Nyalakan/Matikan lampu area Indoor/Outdoor langsung dari layar kasir.

## 9. PENUTUPAN & SHUTDOWN
1. **Logout**: Klik icon **Logout** di pojok kiri bawah sidebar untuk mencatat absen pulang.
2. **Shutdown Tablet**: 
    - Buka menu **System** (Icon Power merah).
    - Klik **"SHUTDOWN SEKARANG"**.
    - Konfirmasi dua kali (Double Confirm). Tablet akan mati otomatis dalam 10 detik.

---

**Tips Keamanan:** *Jangan bagikan PIN Anda kepada rekan lain. Setiap tindakan (void/hapus menu) akan tercatat oleh sistem atas nama Anda.*

---
*Dokumen Panduan Dasar G-Coffee POS v2.5 | Update: 11 Februari 2026*
