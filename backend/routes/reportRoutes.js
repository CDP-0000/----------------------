// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/daily-duty', reportController.createDailyDuty);
router.post('/teaching-summary', reportController.createTeachingSummary);

module.exports = router;