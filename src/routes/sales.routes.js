const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales.controller');

// POST /api/sales
router.post('/', salesController.create);
router.get('/pending', salesController.getPending);
router.put('/complete/:id', salesController.complete);
router.post('/reprint/:id', salesController.reprint);
router.put('/update-items/:id', salesController.updateItems);
router.delete('/:id', salesController.delete);

module.exports = router;
