const Notice = require('../models/Notice');
const Student = require('../models/Student');

exports.listNotices = async (req, res, next) => {
  try {
    const { target } = req.query;
    const filter = target ? { target } : {};
    res.json(await Notice.find(filter).populate('class batch').sort({ createdAt: -1 }));
  } catch (err) { next(err); }
};

exports.createNotice = async (req, res, next) => {
  try { res.status(201).json(await Notice.create({ ...req.body, createdBy: req.user._id })); } catch (err) { next(err); }
};

exports.updateNotice = async (req, res, next) => {
  try { res.json(await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (err) { next(err); }
};

exports.deleteNotice = async (req, res, next) => {
  try { await Notice.findByIdAndDelete(req.params.id); res.json({ message: 'Notice deleted' }); } catch (err) { next(err); }
};

exports.getMyNotices = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('class batch');
    if (!student) return res.json([]);
    res.json(await Notice.find({
      $or: [{ target: 'ALL' }, { target: 'CLASS', class: student.class }, { target: 'BATCH', batch: student.batch }]
    }).sort({ createdAt: -1 }));
  } catch (err) { next(err); }
};
