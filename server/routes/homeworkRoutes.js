const express = require('express');
const router = express.Router();
const homeworkController = require('../controllers/homeworkController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', homeworkController.listHomework);
router.post('/', restrictTo('ADMIN','TEACHER'), homeworkController.createHomework);
router.put('/:id', restrictTo('ADMIN','TEACHER'), homeworkController.updateHomework);
router.delete('/:id', restrictTo('ADMIN','TEACHER'), homeworkController.deleteHomework);
router.get('/my', homeworkController.getMyHomework);

module.exports = router;
