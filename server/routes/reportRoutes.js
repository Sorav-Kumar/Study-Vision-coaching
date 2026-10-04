const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/summary', protect, restrictTo('ADMIN'), reportController.getReportSummary);

module.exports = router;
