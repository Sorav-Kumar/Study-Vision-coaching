const Timetable = require('../models/Timetable');
const Student = require('../models/Student');

exports.listTimetable = async (req, res, next) => {
  try {
    const { batchId, classId } = req.query;
    const filter = {};
    if (batchId) filter.batch = batchId;
    if (classId) filter.class = classId;
    res.json(await Timetable.find(filter).populate('class batch teacher').sort({ day: 1, startTime: 1 }));
  } catch (err) { next(err); }
};

exports.createTimetableEntry = async (req, res, next) => {
  try { res.status(201).json(await Timetable.create(req.body)); } catch (err) { next(err); }
};

exports.updateTimetableEntry = async (req, res, next) => {
  try { res.json(await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (err) { next(err); }
};

exports.deleteTimetableEntry = async (req, res, next) => {
  try { await Timetable.findByIdAndDelete(req.params.id); res.json({ message: 'Entry deleted' }); } catch (err) { next(err); }
};

exports.getMyTimetable = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('class batch');
    if (!student) return res.json([]);
    res.json(await Timetable.find({
      $or: [{ batch: student.batch }, { class: student.class }]
    }).sort({ day: 1, startTime: 1 }));
  } catch (err) { next(err); }
};
