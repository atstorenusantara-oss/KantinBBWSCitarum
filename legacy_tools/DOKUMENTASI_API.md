# DOKUMENTASI API - G-COFFEE POS v2.5
**Sistem Kasir Modern, Inventaris Otomatis (BOM), & Building Management System (BMS)**

Dokumentasi ini berisi daftar lengkap endpoint API yang digunakan dalam aplikasi G-Coffee POS.

---

## 🚩 INFORMASI DASAR
- **Base URL**: `http://[IP_SERVER]:3000/api`
- **Format Data**: `JSON`
- **Default Port**: `3000` (Bisa diubah di `.env`)

---

## 🛒 1. SALES (PENJUALAN)

### **A. Buat Transaksi**
- **Endpoint**: `POST /sales`
- **Body**: `{ invoice_number, customer_name, items[], total, payment_method, payment_status, should_print }`

### **B. Pending Sales**
- **Endpoint**: `GET /sales/pending` (List piutang)

### **C. Update/Complete**
- **Endpoint**: `PUT /sales/complete/:id` (Bayar piutang)
- **PUT /sales/update-items/:id** (Tambah menu ke bill lama)

### **D. Reprint**
- **Endpoint**: `POST /sales/reprint/:id` (Cetak ulang struk)

---

## 📦 2. PRODUCTS & STOCK

### **A. Products**
- **GET /products**: Ambil katalog menu.
- **GET /products/:id/recipe**: Ambil detail resep (BOM).

### **B. Stock Audit (Opname)**
- **GET /stock/materials**: List bahan baku.
- **POST /stock/opname**: Simpan hasil audit fisik.
- **GET /stock/opname/history**: Riwayat audit (filter: daily/weekly/monthly).

---

## 📊 3. REPORTS & AI

### **A. Reports**
- **GET /reports/daily**: Laporan per shift (Shift 1 = 06-17, Shift 2 = 17-03).
- **GET /reports/weekly / monthly**: Laporan omzet berkala.
- **GET /reports/inventory**: Sisa stok real-time.

### **B. AI Insights**
- **GET /auth/ai-insights**: Analisa anomali stok (Penjualan vs Stok Fisik).

---

## 🔐 4. AUTH & USERS

### **A. Login/Logout**
- **POST /auth/login**: Username & PIN 4 Digit.
- **POST /auth/logout**: Mencatat absen pulang.

### **B. Attendance**
- **GET /auth/attendance**: Log absen 7 hari terakhir.

### **C. Management**
- **POST /auth/verify-admin**: Verifikasi PIN Manager (untuk Void/Aksi sensitif).
- **POST /auth/void-log**: Mencatat log penghapusan item keranjang.

---

## 🏛️ 5. BMS & IOT

### **A. Devices**
- **GET /bms/devices**: Status real-time sensor & lampu.
- **PUT /bms/devices/:id**: Kontrol lampu/AC (ON/OFF).

### **B. Telemetry (IoT Only)**
- **POST /bms/telemetry**: ESP32 kirim data sensor.
- **GET /bms/status?name=X**: ESP32 cek status relay.

---

## 💻 6. SYSTEM (MANAJEMEN PERANGKAT)

### **A. Shutdown Tablet**
Mematikan perangkat tablet secara remote/via aplikasi.
- **Endpoint**: `POST /system/shutdown`
- **Aksi**: Menjalankan perintah `shutdown /s /t 10` pada Windows.
- **Keamanan**: Direkomendasikan melakukan verifikasi PIN Manager di frontend.

---

*Dokumentasi API G-Coffee POS v2.5 | Terakhir Diperbarui: 11 Februari 2026*
