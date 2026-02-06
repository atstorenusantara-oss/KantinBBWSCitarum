const productService = require('../services/product.service');
const recipeService = require('../services/recipe.service');

class ProductController {
    async getAll(req, res) {
        try {
            const products = await productService.getAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const product = await productService.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Recipe handlers
    async addRecipe(req, res) {
        try {
            const { productId } = req.params;
            const { details } = req.body; // Array of {raw_material_id, qty}
            const result = await recipeService.createRecipe(productId, details);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecipe(req, res) {
        try {
            const { productId } = req.params;
            const recipe = await recipeService.getRecipeByProduct(productId);
            res.json(recipe);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new ProductController();
