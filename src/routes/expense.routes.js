const express = require('express');
const router = express.Router();
const db = require('../database/connection');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../public/uploads/expenses');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/', async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const { user_id, type, item_id, item_name, qty, amount, image_base64 } = req.body;
        const id = uuidv4();

        let imageUrl = null;
        if (image_base64) {
            const base64Data = image_base64.replace(/^data:image\/\w+;base64,/, "");
            const fileName = `${id}.jpg`;
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, base64Data, 'base64');
            imageUrl = `/uploads/expenses/${fileName}`;
        }

        const query = `
            INSERT INTO expenses (id, user_id, type, item_id, item_name, qty, amount, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await conn.query(query, [id, user_id, type, item_id, item_name, qty || 0, amount, imageUrl]);

        // If it's a raw material, update warehouse stock
        if (type === 'BAHAN_BAKU' && item_id) {
            // Update or Insert into warehouse_stock
            const [existing] = await conn.query('SELECT stock FROM warehouse_stock WHERE raw_material_id = ?', [item_id]);
            if (existing.length > 0) {
                await conn.query('UPDATE warehouse_stock SET stock = stock + ? WHERE raw_material_id = ?', [qty, item_id]);
            } else {
                await conn.query('INSERT INTO warehouse_stock (id, raw_material_id, stock) VALUES (?, ?, ?)', [uuidv4(), item_id, qty]);
            }
        }

        await conn.commit();
        res.json({ success: true, message: 'Laporan belanja berhasil disimpan dan stok gudang diperbarui' });
    } catch (error) {
        await conn.rollback();
        console.error('Expense Error:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        conn.release();
    }
});

router.get('/warehouse', async (req, res) => {
    try {
        const query = `
            SELECT 
                rm.name, 
                rm.unit, 
                ws.stock, 
                ws.updated_at,
                (SELECT image_url FROM expenses WHERE item_id = ws.raw_material_id AND image_url IS NOT NULL ORDER BY created_at DESC LIMIT 1) as last_image,
                (SELECT u.username FROM expenses e JOIN users u ON e.user_id = u.id WHERE e.item_id = ws.raw_material_id ORDER BY e.created_at DESC LIMIT 1) as last_staff
            FROM warehouse_stock ws
            JOIN raw_materials rm ON ws.raw_material_id = rm.id
            ORDER BY rm.name
        `;
        const [rows] = await db.query(query);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/today', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.*, rm.name as material_name, u.username as staff_name
            FROM expenses e 
            LEFT JOIN raw_materials rm ON e.item_id = rm.id 
            LEFT JOIN users u ON e.user_id = u.id
            WHERE DATE(e.created_at) = CURDATE() 
            ORDER BY e.created_at DESC
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const { id } = req.params;
        const { qty, amount } = req.body;

        // Check if already edited
        const [expense] = await conn.query('SELECT * FROM expenses WHERE id = ?', [id]);
        if (!expense.length) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        if (expense[0].is_edited) return res.status(403).json({ success: false, message: 'Maaf, data hanya boleh diedit 1 kali' });

        const oldQty = parseFloat(expense[0].qty);
        const newQty = parseFloat(qty);
        const diff = newQty - oldQty;

        // Update expense
        await conn.query('UPDATE expenses SET qty = ?, amount = ?, is_edited = TRUE WHERE id = ?', [newQty, amount, id]);

        // If it was a warehouse item, adjust warehouse stock
        if (expense[0].type === 'BAHAN_BAKU' && expense[0].item_id) {
            await conn.query('UPDATE warehouse_stock SET stock = stock + ? WHERE raw_material_id = ?', [diff, expense[0].item_id]);
        }

        await conn.commit();
        res.json({ success: true, message: 'Data berhasil diperbarui' });
    } catch (error) {
        await conn.rollback();
        res.status(500).json({ success: false, error: error.message });
    } finally {
        conn.release();
    }
});

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM expenses ORDER BY created_at DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
