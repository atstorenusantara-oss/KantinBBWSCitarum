const express = require('express');
const router = express.Router();
const qrisController = require('../controllers/qris.controller');

// POST /api/qris/webhook
// This is the public endpoint for TemanQRIS
router.post('/webhook', qrisController.handleWebhook);

// POST /api/qris/verify/:invoiceNumber
// Manual verify from POS Dashboard
router.post('/verify/:invoiceNumber', qrisController.manualVerify);

// GET /api/qris/check/:invoiceNumber
// Automatic check from POS Dashboard
router.get('/check/:invoiceNumber', qrisController.checkStatus);

module.exports = router;
