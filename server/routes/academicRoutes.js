const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/classes', academicController.listClasses);
router.post('/classes', restrictTo('ADMIN'), academicController.createClass);
router.put('/classes/:id', restrictTo('ADMIN'), academicController.updateClass);
router.delete('/classes/:id', restrictTo('ADMIN'), academicController.deleteClass);

router.get('/courses', academicController.listCourses);
router.post('/courses', restrictTo('ADMIN'), academicController.createCourse);
router.put('/courses/:id', restrictTo('ADMIN'), academicController.updateCourse);
router.delete('/courses/:id', restrictTo('ADMIN'), academicController.deleteCourse);

router.get('/batches', academicController.listBatches);
router.post('/batches', restrictTo('ADMIN'), academicController.createBatch);
router.put('/batches/:id', restrictTo('ADMIN'), academicController.updateBatch);
router.delete('/batches/:id', restrictTo('ADMIN'), academicController.deleteBatch);

module.exports = router;
