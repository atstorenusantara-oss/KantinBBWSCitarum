const express = require('express');
const router = express.Router();
const licenseService = require('../services/license.service');

// Middleware untuk memproteksi API POS jika belum teraktivasi
const useLicenseProtection = (req, res, next) => {
    // Abaikan rute API lisensi sendiri agar frontend bisa melakukan aktivasi
    if (req.path.startsWith('/api/license') || req.path === '/' || req.path.startsWith('/css') || req.path.startsWith('/js') || req.path.startsWith('/assets')) {
        return next();
    }

    const check = licenseService.verifyLicense();
    if (!check.isValid) {
        return res.status(403).json({
            error: 'UNAUTHORIZED_HARDWARE',
            message: 'Aplikasi belum diaktivasi untuk PC ini.',
            requestCode: licenseService.getRequestCode(),
            reason: check.reason
        });
    }
    next();
};

// GET /api/license/status
router.get('/status', (req, res) => {
    const check = licenseService.verifyLicense();
    res.json({
        isValid: check.isValid,
        reason: check.reason || null,
        requestCode: licenseService.getRequestCode()
    });
});

// POST /api/license/activate
router.post('/activate', (req, res) => {
    const { activationCode } = req.body;
    if (!activationCode) {
        return res.status(400).json({ success: false, message: 'Kode aktivasi wajib diisi.' });
    }

    const result = licenseService.activate(activationCode);
    res.json(result);
});

// Ekspor modul router dan middleware
module.exports = {
    router,
    useLicenseProtection
};
