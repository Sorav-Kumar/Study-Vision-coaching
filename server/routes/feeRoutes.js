const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', feeController.listFees);
router.post('/', restrictTo('ADMIN'), feeController.createFee);
router.put('/:id', restrictTo('ADMIN'), feeController.updateFee);
router.delete('/:id', restrictTo('ADMIN'), feeController.deleteFee);

router.get('/payments', feeController.listPayments);
router.post('/payments', restrictTo('ADMIN'), feeController.createPayment);

router.get('/my', feeController.getMyFees);

module.exports = router;
