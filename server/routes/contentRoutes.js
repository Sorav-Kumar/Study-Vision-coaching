const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/gallery', contentController.listGallery);
router.post('/gallery', protect, restrictTo('ADMIN'), contentController.createGalleryItem);
router.delete('/gallery/:id', protect, restrictTo('ADMIN'), contentController.deleteGalleryItem);

router.get('/faculty', contentController.listFaculty);
router.post('/faculty', protect, restrictTo('ADMIN'), contentController.createFaculty);
router.put('/faculty/:id', protect, restrictTo('ADMIN'), contentController.updateFaculty);
router.delete('/faculty/:id', protect, restrictTo('ADMIN'), contentController.deleteFaculty);

router.get('/settings', contentController.getSettings);
router.put('/settings', protect, restrictTo('ADMIN'), contentController.updateSettings);

module.exports = router;
