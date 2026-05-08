const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.get('/daily', reportController.getDaily);
router.get('/weekly', reportController.getWeekly);
router.get('/monthly', reportController.getMonthly);
router.get('/inventory', reportController.getInventory);
router.get('/sale/:id', reportController.getSaleDetail);
router.get('/owner/summary', reportController.getOwnerSummary);

module.exports = router;
