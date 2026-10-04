const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  test:           { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  student:        { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  marksObtained:  { type: Number, default: 0 },
}, { timestamps: true });

testResultSchema.index({ test: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('TestResult', testResultSchema);
