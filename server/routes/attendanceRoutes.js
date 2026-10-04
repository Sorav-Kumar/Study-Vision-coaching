const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', attendanceController.listAttendance);
router.post('/', restrictTo('ADMIN','TEACHER'), attendanceController.saveAttendance);
router.get('/student/:studentId', attendanceController.getStudentAttendance);

module.exports = router;
