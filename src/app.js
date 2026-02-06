const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Melayani file frontend statis

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "G-Coffee POS API is running..." });
});

// Routes
app.use('/api/sales', require('./routes/sales.routes.js'));
app.use('/api/products', require('./routes/product.routes.js'));
app.use('/api/stock', require('./routes/stock.routes.js'));
app.use('/api/reports', require('./routes/report.routes.js'));
app.use('/api/bms', require('./routes/bms.routes.js'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
