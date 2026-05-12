const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');

// GET /api/products?stand_id=xxx — filter by stand, or all if no param
router.get('/', async (req, res) => {
    try {
        const { stand_id } = req.query;
        const products = await productService.getAll(stand_id || null);
        res.json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/products/categories?stand_id=xxx — distinct categories for a stand
router.get('/categories', async (req, res) => {
    try {
        const { stand_id } = req.query;
        const categories = await productService.getCategoriesByStand(stand_id);
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const product = await productService.create(req.body);
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
