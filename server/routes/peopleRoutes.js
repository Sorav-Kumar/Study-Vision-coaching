const express = require('express');
const router = express.Router();
const peopleController = require('../controllers/peopleController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/students', peopleController.listStudents);
router.get('/students/:id', peopleController.getStudent);
router.post('/students', restrictTo('ADMIN'), peopleController.createStudent);
router.put('/students/:id', restrictTo('ADMIN'), peopleController.updateStudent);
router.delete('/students/:id', restrictTo('ADMIN'), peopleController.deleteStudent);

router.get('/teachers', peopleController.listTeachers);
router.get('/teachers/:id', peopleController.getTeacher);
router.post('/teachers', restrictTo('ADMIN'), peopleController.createTeacher);
router.put('/teachers/:id', restrictTo('ADMIN'), peopleController.updateTeacher);
router.delete('/teachers/:id', restrictTo('ADMIN'), peopleController.deleteTeacher);

router.get('/parents', peopleController.listParents);
router.post('/parents', restrictTo('ADMIN'), peopleController.createParent);

module.exports = router;
