const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', noteController.listNotes);
router.get('/:id', noteController.getNote);
router.post('/', restrictTo('ADMIN','TEACHER'), noteController.createNote);
router.put('/:id', restrictTo('ADMIN','TEACHER'), noteController.updateNote);
router.delete('/:id', restrictTo('ADMIN','TEACHER'), noteController.deleteNote);

module.exports = router;
