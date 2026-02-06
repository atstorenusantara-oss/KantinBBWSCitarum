const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

// Route untuk mencatat stock opname baru (Poin 6.2)
router.post('/opname', stockController.createOpname);

// Route untuk melihat riwayat opname
router.get('/opname/history', stockController.getHistory);

// Route untuk mendapatkan list bahan baku (untuk dropdown opname)
router.get('/materials', stockController.getAllMaterials);

module.exports = router;
