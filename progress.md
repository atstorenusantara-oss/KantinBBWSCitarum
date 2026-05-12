# 📝 Progress Pengembangan: POS Kantin BBWS Citarum

File ini adalah acuan utama koordinasi pengembangan sistem dari **G-Coffee POS v2** menjadi **Kantin BBWS Citarum (V3)**.

---

## 🚀 Status Saat Ini
- **Fase 1 (Core Migration):** ✅ SELESAI
- **Fase 2 (Data Entry):** ✅ SELESAI
- **Fase 3 (Multi-Stand Logic):** ✅ SELESAI
- **Fase 4 (Reporting & Dashboard):** ⏳ DALAM PENGERJAAN (API Ready)

---

## ✅ Milestone Selesai (Completed)

### 1. Migrasi & Arsitektur Database
- [x] Migrasi database ke `bbwscitarum`.
- [x] Reset total data historis G-Coffee (Clean Slate).
- [x] Pembuatan tabel `stands` (Multi-tenant support).
- [x] Integrasi `stand_id` pada tabel `products`, `users`, dan `sales`.
- [x] Penghapusan permanen modul BMS (Building Management System).

### 2. Backend (API) Development
- [x] Update `auth.routes.js`: Login kasir sekarang otomatis mendeteksi Stand.
- [x] Update `product.routes.js`: API filter produk berdasarkan stand aktif.
- [x] Update `sales.service.js`: Transaksi otomatis mencatat `stand_id`.
- [x] Disable logic BOM (Bill of Materials) & Stock Reduction (Mode Kantin Sederhana).
- [x] API Baru `/api/stands`: Summary data per-stand untuk Owner.

### 3. Frontend (UI/UX) Adjustments
- [x] **Dynamic Sidebar:** Menampilkan inisial kode stand di sidebar.
- [x] **Stand Context:** Nama Stand aktif muncul di header Kasir.
- [x] **Dynamic Categories:** Tombol kategori (Makanan, Jus, dll) berubah otomatis sesuai menu stand masing-masing.
- [x] **Product Filtering:** Kasir Stand A tidak bisa melihat/menjual menu Stand B.

### 4. Menu & Data Entry (±109 Item)
- [x] **Stand A (Bu Jimmy):** 21 Menu (Tutug Oncom, Seafood, dll).
- [x] **Stand B (Bu Ati):** 10 Menu (Warmindo, Rice Bowl, dll).
- [x] **Stand C (DWP):** 39 Menu (Jus, Kopi Hot/Ice, Snack).
- [x] **Stand D (Bu Suminah):** 10 Menu (Rawon, Pepes, dll).
- [x] **Stand E (Pa Indra/Bu Marga):** 12 Menu (Soto Tangkar, Ayam Goreng).
- [x] **Stand F1 (Mang Nunu):** 7 Menu (Batagor, Baso Tahu).
- [x] **Stand F2 (Bu Kimun):** 10 Menu (Bubur Ayam, Seblak, dll).

---

## ⏳ Rencana Pengembangan (Roadmap)

### Prioritas Tinggi (High Priority)
- [ ] **Owner Dashboard UI:** Halaman khusus bagi Owner untuk melihat grafik perbandingan omzet antar stand dalam satu layar.
- [ ] **Print Struk Customize:** Menambahkan nama Stand dan nama Pemilik di bagian atas struk thermal.
- [ ] **Expense per Stand:** Memisahkan input pengeluaran (biaya gas, bahan, dll) agar laporan profit per-stand lebih akurat.

### Prioritas Menengah (Medium Priority)
- [ ] **Manajemen User UI:** Menu bagi Admin/Owner untuk menambah/edit akun kasir dan ganti PIN langsung dari aplikasi.
- [ ] **Laporan Bulanan Automatis:** Export laporan rangkuman penjualan semua stand ke Excel/PDF untuk kebutuhan administrasi BBWS.

---

## 🔑 Referensi Teknis

### Daftar Akun Kasir
| Username | PIN | Stand |
|----------|-----|-------|
| `Owner` | `0000` | (Super Admin) |
| `KasirA` | `1111` | Stand A |
| `KasirB` | `2222` | Stand B |
| `KasirC` | `3333` | Stand C |
| `KasirD` | `4444` | Stand D |
| `KasirE` | `5555` | Stand E |
| `KasirF1` | `6611` | Stand F1 |
| `KasirF2` | `6622` | Stand F2 |

### Database Info
- **Host:** `localhost`
- **Name:** `bbwscitarum`
- **Port:** `3000`

---
*Terakhir diupdate: 12 Mei 2026*
