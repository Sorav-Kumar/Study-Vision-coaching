const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

router.get('/', enquiryController.listEnquiries);
router.post('/', enquiryController.createEnquiry);
router.put('/:id', enquiryController.updateEnquiry);
router.delete('/:id', enquiryController.deleteEnquiry);

module.exports = router;
