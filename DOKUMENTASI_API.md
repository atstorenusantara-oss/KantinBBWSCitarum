# DOKUMENTASI API - G-COFFEE POS v2.2

Dokumentasi ini berisi daftar lengkap endpoint API yang digunakan dalam aplikasi G-Coffee POS untuk integrasi frontend, backend, dan database.

---

## 🚩 INFORMASI DASAR
- **Base URL**: `http://localhost:3000/api`
- **Format Data**: `JSON`
- **Standard response**:
  ```json
  {
      "success": true,
      "message": "Pesan status",
      "data": { ... }
  }
  ```

---

## 🛒 1. SALES (PENJUALAN & PIUTANG)

### **A. Buat Transaksi Baru**
Digunakan untuk mencatat penjualan lunas maupun pesanan pending.
- **Endpoint**: `POST /sales`
- **Request Body**:
  ```json
  {
      "invoice_number": "INV-123456",
      "customer_name": "Atjas",
      "items": [
          { "product_id": "UUID", "qty": 2, "price": 15000 }
      ],
      "total": 33000,
      "payment_method": "CASH",
      "payment_status": "PAID" // Pilihan: PAID atau PENDING
  }
  ```

### **B. Ambil Daftar Pesanan Pending**
Mengambil semua transaksi yang statusnya masih `PENDING`.
- **Endpoint**: `GET /sales/pending`
- **Response**: Array berisi data pelanggan, nominal, dan ringkasan menu yang dipesan.

### **C. Pelunasan Pembayaran**
Mengubah status transaksi dari `PENDING` menjadi `PAID`.
- **Endpoint**: `PUT /sales/complete/:id`
- **Request Body**:
  ```json
  {
      "payment_method": "QRIS" // Pilihan: CASH atau QRIS
  }
  ```

---

## 📦 2. PRODUCTS (PRODUK & RESEP)

### **A. Ambil Semua Produk**
- **Endpoint**: `GET /products`
- **Fitur**: Mengambil semua menu yang aktif beserta URL gambarnya.

### **B. Ambil Resep Produk (BOM)**
- **Endpoint**: `GET /products/:productId/recipe`
- **Response**: Daftar bahan baku dan takaran yang dibutuhkan untuk membuat produk tersebut.

---

## 🏗️ 3. STOCK (MANAJEMEN BAHAN BAKU)

### **A. Ambil Semua Bahan Baku**
- **Endpoint**: `GET /stock/materials`
- **Kegunaan**: Mengambil list bahan baku untuk dropdown pada menu Stock Opname.

### **B. Catat Stock Opname**
Melakukan audit stok fisik.
- **Endpoint**: `POST /stock/opname`
- **Request Body**:
  ```json
  {
      "raw_material_id": "ID_BAHAN",
      "physical_stock": 500,
      "note": "Barang tumpah"
  }
  ```

### **C. Riwayat Stock Opname**
- **Endpoint**: `GET /stock/opname/history`
- **Query Params**: `filter` (daily/weekly/monthly), `date` (YYYY-MM-DD).

---

## 📊 4. REPORTS (LAPORAN & AUDIT)

### **A. Laporan Harian (Shift)**
- **Endpoint**: `GET /reports/daily`
- **Query Params**: 
    - `date`: Tanggal laporan (default: hari ini).
    - `shift`: 1 (Pagi) atau 2 (Malam).
- **Data**: Total omzet (hanya PAID), breakdown Cash/QRIS, Top 5 Produk, dan daftar Piutang per shift.

### **B. Laporan Mingguan & Bulanan**
- **Endpoint**: `GET /reports/weekly`
- **Endpoint**: `GET /reports/monthly`
- **Data**: Rekap total omzet dan jumlah transaksi lunas.

### **C. Status Inventaris Real-time**
- **Endpoint**: `GET /reports/inventory`
- **Data**: Mengambil sisa stok terakhir semua bahan baku dan packaging untuk pemantauan ketersediaan.

---

## ⚠️ CATATAN TEKNIS
1. **Potong Stok Otomatis**: Setiap transaksi yang dibuat (baik PAID/PENDING) akan otomatis memotong stok di database melalui `stock.service.js`.
2. **Validasi Shift**: Jam operasional shift ditentukan secara fleksibel melalui database (tabel `settings`).
3. **Keamanan**: Untuk saat ini API belum menggunakan Token/API Key (Dijalankan di Jaringan Lokal).

---
*Dokumentasi API G-Coffee POS v2.2 | Update: 6 Februari 2026*
