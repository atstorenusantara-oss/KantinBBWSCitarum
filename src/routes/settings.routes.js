const express = require('express');
const router = express.Router();
const settingsService = require('../services/settings.service');

// Get all settings
router.get('/', async (req, res) => {
    try {
        const settings = await settingsService.getSettings();
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check if menu editor is enabled
router.get('/menu-editor', async (req, res) => {
    try {
        const settings = await settingsService.getSettings();
        // If not set, default to false (0 or '0')
        const isActive = settings['ENABLE_MENU_EDITOR'] === '1' || settings['ENABLE_MENU_EDITOR'] === 1;
        res.json({ success: true, data: { is_active: isActive } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update a setting
router.post('/update', async (req, res) => {
    try {
        const { key, value } = req.body;
        await settingsService.updateSetting(key, value);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get activity logs
router.get('/logs', async (req, res) => {
    try {
        const logs = await settingsService.getActivityLogs();
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Log an activity manually (optional)
router.post('/log', async (req, res) => {
    try {
        const { userId, action, note } = req.body;
        await settingsService.logActivity(userId, action, note);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
