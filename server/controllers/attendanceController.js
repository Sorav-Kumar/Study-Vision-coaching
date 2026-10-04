const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

exports.listAttendance = async (req, res, next) => {
  try {
    const { batchId, date, studentId } = req.query;
    const filter = {};
    if (batchId) filter.batch = batchId;
    if (date) filter.date = date;
    if (studentId) filter.student = studentId;
    res.json(await Attendance.find(filter).populate('student batch').sort({ date: -1 }));
  } catch (err) { next(err); }
};

exports.saveAttendance = async (req, res, next) => {
  try {
    const { records, batchId, date } = req.body;
    const results = [];
    for (const r of records) {
      const existing = await Attendance.findOne({ student: r.student, date: date });
      if (existing) {
        existing.status = r.status;
        existing.markedBy = req.user._id;
        await existing.save();
        results.push(existing);
      } else {
        const att = await Attendance.create({ student: r.student, batch: batchId, date, status: r.status, markedBy: req.user._id });
        results.push(att);
      }
    }
    res.status(201).json(results);
  } catch (err) { next(err); }
};

exports.getStudentAttendance = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const studentId = req.params.studentId || (student?._id);
    res.json(await Attendance.find({ student: studentId }).sort({ date: -1 }));
  } catch (err) { next(err); }
};
