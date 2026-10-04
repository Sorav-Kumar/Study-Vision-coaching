const Homework = require('../models/Homework');
const Student = require('../models/Student');

exports.listHomework = async (req, res, next) => {
  try {
    const { batchId, classId } = req.query;
    const filter = {};
    if (batchId) filter.batch = batchId;
    if (classId) filter.class = classId;
    res.json(await Homework.find(filter).populate('class batch').sort({ dueDate: -1 }));
  } catch (err) { next(err); }
};

exports.createHomework = async (req, res, next) => {
  try { res.status(201).json(await Homework.create({ ...req.body, createdBy: req.user._id })); } catch (err) { next(err); }
};

exports.updateHomework = async (req, res, next) => {
  try { res.json(await Homework.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (err) { next(err); }
};

exports.deleteHomework = async (req, res, next) => {
  try { await Homework.findByIdAndDelete(req.params.id); res.json({ message: 'Homework deleted' }); } catch (err) { next(err); }
};

exports.getMyHomework = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('class batch');
    if (!student) return res.json([]);
    res.json(await Homework.find({
      $or: [{ batch: student.batch }, { class: student.class }]
    }).sort({ dueDate: -1 }));
  } catch (err) { next(err); }
};
