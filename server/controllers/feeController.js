const Fee = require('../models/Fee');
const FeePayment = require('../models/FeePayment');
const Student = require('../models/Student');

exports.listFees = async (req, res, next) => {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { student: studentId } : {};
    res.json(await Fee.find(filter).populate('student').sort({ createdAt: -1 }));
  } catch (err) { next(err); }
};

exports.createFee = async (req, res, next) => {
  try { res.status(201).json(await Fee.create(req.body)); } catch (err) { next(err); }
};

exports.updateFee = async (req, res, next) => {
  try { res.json(await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (err) { next(err); }
};

exports.deleteFee = async (req, res, next) => {
  try { await Fee.findByIdAndDelete(req.params.id); res.json({ message: 'Fee deleted' }); } catch (err) { next(err); }
};

exports.listPayments = async (req, res, next) => {
  try {
    const { feeId } = req.query;
    const filter = feeId ? { fee: feeId } : {};
    res.json(await FeePayment.find(filter).populate({ path: 'fee', populate: { path: 'student' } }).sort({ paymentDate: -1 }));
  } catch (err) { next(err); }
};

exports.createPayment = async (req, res, next) => {
  try {
    const payment = await FeePayment.create(req.body);
    const fee = await Fee.findById(req.body.fee);
    if (fee) {
      fee.paidAmount = (fee.paidAmount || 0) + req.body.amount;
      await fee.save();
    }
    res.status(201).json(payment);
  } catch (err) { next(err); }
};

exports.getMyFees = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.json([]);
    const fees = await Fee.find({ student: student._id });
    const feeIds = fees.map(f => f._id);
    const payments = await FeePayment.find({ fee: { $in: feeIds } });
    res.json({ fees, payments });
  } catch (err) { next(err); }
};
