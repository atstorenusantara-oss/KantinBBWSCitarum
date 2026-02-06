const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class RecipeService {
    /**
     * Create recipe for a product
     * @param {string} productId 
     * @param {Array} details - [{ raw_material_id, qty }]
     */
    async createRecipe(productId, details) {
        const recipeId = uuidv4();
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Create main recipe record
            await connection.query(
                'INSERT INTO recipes (id, product_id) VALUES (?, ?)',
                [recipeId, productId]
            );

            // 2. Insert recipe details
            for (const item of details) {
                await connection.query(
                    'INSERT INTO recipe_details (id, recipe_id, raw_material_id, qty) VALUES (?, ?, ?, ?)',
                    [uuidv4(), recipeId, item.raw_material_id, item.qty]
                );
            }

            await connection.commit();
            return { recipeId, productId, details };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getRecipeByProduct(productId) {
        const [rows] = await db.query(
            `SELECT rd.raw_material_id, rm.name as material_name, rd.qty, rm.unit
             FROM recipe_details rd
             JOIN recipes r ON rd.recipe_id = r.id
             JOIN raw_materials rm ON rd.raw_material_id = rm.id
             WHERE r.product_id = ?`,
            [productId]
        );
        return rows;
    }
}

module.exports = new RecipeService();
