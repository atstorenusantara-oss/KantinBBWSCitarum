const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'public/assets/img/products/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

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

// PUT /api/products/:id
router.put('/:id', (req, res) => {
    upload.single('image')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ success: false, message: `Unknown error: ${err.message}` });
        }

        try {
            const { id } = req.params;
            const updateData = { ...req.body };
            
            if (updateData.price) updateData.price = Number(updateData.price);
            if (updateData.is_active !== undefined) updateData.is_active = Number(updateData.is_active);
            
            if (req.file) {
                updateData.image_url = `/assets/img/products/${req.file.filename}`;
            }
            
            const updated = await productService.update(id, updateData);
            res.json({ success: true, data: updated });
        } catch (error) {
            console.error('Update Product Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    });
});

module.exports = router;
