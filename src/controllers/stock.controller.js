const stockService = require('../services/stock.service');
const materialService = require('../services/material.service');

class StockController {
    /**
     * Get all materials for dropdown
     */
    async getAllMaterials(req, res) {
        try {
            const materials = await materialService.getAll();
            res.json({ success: true, data: materials });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    /**
     * Create new stock opname
     */
    async createOpname(req, res) {
        try {
            const { raw_material_id, physical_stock, note } = req.body;

            if (!raw_material_id || physical_stock === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Raw material ID and physical stock are required'
                });
            }

            const result = await stockService.processStockOpname(
                raw_material_id,
                parseFloat(physical_stock),
                note || ''
            );

            res.status(201).json({
                success: true,
                message: 'Stock opname processed successfully',
                data: result
            });
        } catch (error) {
            console.error('Error in createOpname:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    /**
     * Get opname history
     */
    async getHistory(req, res) {
        try {
            const { filter, date } = req.query;
            const history = await stockService.getOpnameHistory(filter, date);
            res.json({
                success: true,
                data: history
            });
        } catch (error) {
            console.error('Error in getHistory:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

module.exports = new StockController();
