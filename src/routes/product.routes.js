const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Product Routes
router.get('/', productController.getAll);
router.post('/', productController.create);

// Recipe Routes (nested under products)
router.get('/:productId/recipe', productController.getRecipe);
router.post('/:productId/recipe', productController.addRecipe);

module.exports = router;
