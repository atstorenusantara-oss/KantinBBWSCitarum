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
router.post('/', (req, res) => {
    upload.single('image')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(500).json({ success: false, message: `Unknown error: ${err.message}` });
        }

        try {
            const productData = { ...req.body };
            
            if (productData.price) productData.price = Number(productData.price);
            if (productData.cost_price !== undefined) productData.cost_price = Number(productData.cost_price);
            if (productData.is_active !== undefined) productData.is_active = Number(productData.is_active);
            
            if (req.file) {
                productData.image_url = `/assets/img/products/${req.file.filename}`;
            }
            
            const product = await productService.create(productData);
            res.json({ success: true, data: product });
        } catch (error) {
            console.error('Create Product Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    });
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
            if (updateData.cost_price !== undefined) updateData.cost_price = Number(updateData.cost_price);
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

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await productService.delete(id);
        res.json({ success: true, message: 'Produk berhasil dihapus' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
