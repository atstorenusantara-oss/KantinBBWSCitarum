# DOKUMENTASI API - G-COFFEE POS v2.4
**Sistem Kasir Modern, Inventaris Otomatis (BOM), & Building Management System (BMS)**

Dokumentasi ini berisi daftar lengkap endpoint API yang digunakan dalam aplikasi G-Coffee POS untuk integrasi frontend, backend, database, dan IoT ESP32.

---

## 🚩 INFORMASI DASAR
- **Base URL**: `http://[IP_SERVER]:3000/api`
- **Format Data**: `JSON`
- **Standard Response**:
  ```json
  {
      "success": true,
      "message": "Pesan status",
      "data": { ... }
  }
  ```

---

## 🛒 1. SALES (PENJUALAN & CABANG)

### **A. Buat Transaksi Baru**
Mencatat penjualan lunas atau pesanan pending. Terintegrasi dengan pemotongan stok otomatis (BOM) dan layanan printer.
- **Endpoint**: `POST /sales`
- **Request Body**:
  ```json
  {
      "invoice_number": "INV-123456",
      "customer_name": "Pelanggan",
      "items": [
          { "product_id": "UUID", "name": "Espresso", "qty": 2, "price": 15000 }
      ],
      "total": 33000,
      "payment_method": "CASH",
      "payment_status": "PAID",
      "should_print": true // Flag untuk cetak struk otomatis (v2.3)
  }
  ```

### **B. Ambil Daftar Pesanan Pending**
Mengambil semua transaksi dengan status `PENDING` (Piutang).
- **Endpoint**: `GET /sales/pending`
- **Response**: Array data pelanggan, total nominal, dan ringkasan menu.

### **C. Pelunasan Pembayaran**
Mengubah status transaksi dari `PENDING` ke `PAID`.
- **Endpoint**: `PUT /sales/complete/:id`
- **Request Body**: `{ "payment_method": "QRIS" }`

### **D. Cetak Ulang Struk (Reprint) - NEW v2.3**
Mengirim ulang perintah cetak ke thermal printer untuk transaksi yang sudah ada.
- **Endpoint**: `POST /sales/reprint/:id`
- **Response**: Status keberhasilan pengiriman perintah ke printer.

---

## 📦 2. PRODUCTS (PRODUK & VARIAN)

### **A. Ambil Semua Produk**
- **Endpoint**: `GET /products`
- **Fitur**: Mengambil semua menu aktif (`is_active: true`). Digunakan untuk grid utama POS.

### **B. Ambil Resep Produk (BOM)**
- **Endpoint**: `GET /products/:productId/recipe`
- **Response**: Daftar bahan baku dan takaran yang dibutuhkan.

---

## 🏗️ 3. STOCK (MANAJEMEN BAHAN BAKU)

### **A. Ambil Semua Bahan Baku**
- **Endpoint**: `GET /stock/materials`
- **Kegunaan**: List bahan baku untuk dropdown menu Stock Opname.

### **B. Catat Stock Opname**
Melakukan audit stok fisik dan mencatat selisih.
- **Endpoint**: `POST /stock/opname`
- **Request Body**:
  ```json
  {
      "raw_material_id": "UUID",
      "physical_stock": 500,
      "note": "Keterangan audit"
  }
  ```

### **C. Riwayat Stock Opname**
- **Endpoint**: `GET /stock/opname/history`
- **Query Params**: `filter` (daily/weekly/monthly), `date` (YYYY-MM-DD).

---

## 📊 4. REPORTS (LAPORAN & ANALISA)

### **A. Laporan Harian (Shift)**
- **Endpoint**: `GET /reports/daily`
- **Query Params**: `date` (YYYY-MM-DD), `shift` (1 atau 2).
- **Response v2.3**: Mencakup Ringkasan Omzet, Breakdown Payment, Top Products, dan **recent_sales** (untuk daftar cetak ulang).

### **B. Laporan Berkala**
- **Endpoint**: `GET /reports/weekly`
- **Endpoint**: `GET /reports/monthly`

### **C. Status Inventaris**
- **Endpoint**: `GET /reports/inventory`
- **Data**: Sisa stok real-time (bahan baku & packaging).

---

## 🏛️ 5. BMS & IOT (BUILDING MANAGEMENT)

### **A. Status Perangkat (Dashboard)**
- **Endpoint**: `GET /bms/devices`
- **Data**: Status semua sensor dan aktuator (Listrik, Suhu, Air, Lampu).

### **B. Kontrol Perangkat (Actuator)**
- **Endpoint**: `PUT /bms/devices/:id`
- **Request Body**: `{ "value": "ON" atau "OFF" }`

### **C. Kirim Data Telemetry (ESP32)**
Digunakan mikrokontroler untuk mengirim data sensor secara berkala.
- **Endpoint**: `POST /bms/telemetry`
- **Request Body**: `{ "device_name": "Suhu Area Bar", "value": 24.5 }`

### **D. Polling Status (ESP32)**
Digunakan ESP32 untuk mengecek status lampu/relay.
- **Endpoint**: `GET /bms/status?name=[NAMA_PERANGKAT]`

---

## ⚠️ CATATAN TEKNIS
1. **Integritas Data**: Setiap transaksi (PAID/PENDING) memicu `stock.service.js` untuk memotong stok resep (BOM).
2. **Printer Thermal**: Backend membutuhkan konfigurasi `interface` printer yang benar di `printer.service.js`.
3. **IoT ESP32**: Pastikan ESP32 berada di jaringan WiFi yang sama dengan Server agar API dapat dijangkau.

---
*Dokumentasi API G-Coffee POS v2.4 | Terakhir Diperbarui: 10 Februari 2026*
