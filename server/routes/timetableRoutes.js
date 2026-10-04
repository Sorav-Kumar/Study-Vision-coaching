const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', timetableController.listTimetable);
router.post('/', restrictTo('ADMIN'), timetableController.createTimetableEntry);
router.put('/:id', restrictTo('ADMIN'), timetableController.updateTimetableEntry);
router.delete('/:id', restrictTo('ADMIN'), timetableController.deleteTimetableEntry);
router.get('/my', timetableController.getMyTimetable);

module.exports = router;
