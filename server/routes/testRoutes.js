const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', testController.listTests);
router.post('/', restrictTo('ADMIN','TEACHER'), testController.createTest);
router.put('/:id', restrictTo('ADMIN','TEACHER'), testController.updateTest);
router.delete('/:id', restrictTo('ADMIN','TEACHER'), testController.deleteTest);

router.get('/results', testController.listResults);
router.post('/results', restrictTo('ADMIN','TEACHER'), testController.saveResults);
router.get('/my-results', testController.getMyResults);

module.exports = router;
