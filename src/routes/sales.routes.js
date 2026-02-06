const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales.controller');

// POST /api/sales
router.post('/', salesController.create);
router.get('/pending', salesController.getPending);
router.put('/complete/:id', salesController.complete);

module.exports = router;
