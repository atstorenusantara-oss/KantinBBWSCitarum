const express = require('express');
const router = express.Router();
const bmsController = require('../controllers/bms.controller');

router.get('/devices', bmsController.getDevices);
router.put('/devices/:id', bmsController.toggleDevice);
router.post('/telemetry', bmsController.postTelemetry);

module.exports = router;
