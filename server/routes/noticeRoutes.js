const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', noticeController.listNotices);
router.post('/', restrictTo('ADMIN','TEACHER'), noticeController.createNotice);
router.put('/:id', restrictTo('ADMIN','TEACHER'), noticeController.updateNotice);
router.delete('/:id', restrictTo('ADMIN','TEACHER'), noticeController.deleteNotice);
router.get('/my', noticeController.getMyNotices);

module.exports = router;
