const Test = require('../models/Test');
const TestResult = require('../models/TestResult');
const Student = require('../models/Student');

exports.listTests = async (req, res, next) => {
  try {
    const { batchId, classId } = req.query;
    const filter = {};
    if (batchId) filter.batch = batchId;
    if (classId) filter.class = classId;
    res.json(await Test.find(filter).populate('class batch').sort({ testDate: -1 }));
  } catch (err) { next(err); }
};

exports.createTest = async (req, res, next) => {
  try { res.status(201).json(await Test.create({ ...req.body, createdBy: req.user._id })); } catch (err) { next(err); }
};

exports.updateTest = async (req, res, next) => {
  try { res.json(await Test.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (err) { next(err); }
};

exports.deleteTest = async (req, res, next) => {
  try { await Test.findByIdAndDelete(req.params.id); res.json({ message: 'Test deleted' }); } catch (err) { next(err); }
};

exports.listResults = async (req, res, next) => {
  try {
    const { testId, studentId } = req.query;
    const filter = {};
    if (testId) filter.test = testId;
    if (studentId) filter.student = studentId;
    res.json(await TestResult.find(filter).populate({ path: 'test' }).populate({ path: 'student', select: 'fullName' }).sort({ createdAt: -1 }));
  } catch (err) { next(err); }
};

exports.saveResults = async (req, res, next) => {
  try {
    const { testId, results } = req.body;
    const saved = [];
    for (const r of results) {
      const existing = await TestResult.findOne({ test: testId, student: r.student });
      if (existing) {
        existing.marksObtained = r.marksObtained;
        await existing.save();
        saved.push(existing);
      } else {
        saved.push(await TestResult.create({ test: testId, student: r.student, marksObtained: r.marksObtained }));
      }
    }
    res.status(201).json(saved);
  } catch (err) { next(err); }
};

exports.getMyResults = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.json([]);
    res.json(await TestResult.find({ student: student._id }).populate('test').sort({ createdAt: -1 }));
  } catch (err) { next(err); }
};
