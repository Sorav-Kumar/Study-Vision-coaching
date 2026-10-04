const Class = require('../models/Class');
const Course = require('../models/Course');
const Batch = require('../models/Batch');

exports.listClasses = async (req, res, next) => {
  try { res.json(await Class.find().sort({ level: 1 })); } catch (err) { next(err); }
};
exports.createClass = async (req, res, next) => {
  try { res.status(201).json(await Class.create(req.body)); } catch (err) { next(err); }
};
exports.updateClass = async (req, res, next) => {
  try { res.json(await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (err) { next(err); }
};
exports.deleteClass = async (req, res, next) => {
  try { await Class.findByIdAndDelete(req.params.id); res.json({ message: 'Class deleted' }); } catch (err) { next(err); }
};

exports.listCourses = async (req, res, next) => {
  try { res.json(await Course.find().sort({ displayOrder: 1 })); } catch (err) { next(err); }
};
exports.createCourse = async (req, res, next) => {
  try { res.status(201).json(await Course.create(req.body)); } catch (err) { next(err); }
};
exports.updateCourse = async (req, res, next) => {
  try { res.json(await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (err) { next(err); }
};
exports.deleteCourse = async (req, res, next) => {
  try { await Course.findByIdAndDelete(req.params.id); res.json({ message: 'Course deleted' }); } catch (err) { next(err); }
};

exports.listBatches = async (req, res, next) => {
  try { res.json(await Batch.find().populate('class course teacher').sort({ createdAt: -1 })); } catch (err) { next(err); }
};
exports.createBatch = async (req, res, next) => {
  try { res.status(201).json(await Batch.create(req.body)); } catch (err) { next(err); }
};
exports.updateBatch = async (req, res, next) => {
  try { res.json(await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (err) { next(err); }
};
exports.deleteBatch = async (req, res, next) => {
  try { await Batch.findByIdAndDelete(req.params.id); res.json({ message: 'Batch deleted' }); } catch (err) { next(err); }
};
