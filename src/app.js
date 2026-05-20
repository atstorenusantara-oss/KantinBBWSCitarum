require('bytenode');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 1. Jika berjalan di biner pkg, dahulukan serve berkas UI virtual dari dalam biner .exe
if (process.pkg) {
    app.use(express.static(path.join(__dirname, '../public')));
}
// 2. Tetap dukung serve berkas fisik dari folder lokal (misal: gambar produk yang diunggah klien)
app.use(express.static(path.join(process.cwd(), 'public')));

// Daftarkan route lisensi dan pasang middleware proteksi lisensi
const { router: licenseRouter, useLicenseProtection } = require('./routes/license.routes.js');
app.use('/api/license', licenseRouter);
app.use(useLicenseProtection);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "G-Coffee POS API is running..." });
});

// Routes
app.use('/api/sales', require('./routes/sales.routes.js'));
app.use('/api/products', require('./routes/product.routes.js'));
app.use('/api/stock', require('./routes/stock.routes.js'));
app.use('/api/reports', require('./routes/report.routes.js'));
app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/system', require('./routes/system.routes.js'));
app.use('/api/settings', require('./routes/settings.routes.js'));
app.use('/api/expenses', require('./routes/expense.routes.js'));
app.use('/api/qris', require('./routes/qris.routes.js'));
app.use('/api/stands', require('./routes/stands.routes.js'));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
