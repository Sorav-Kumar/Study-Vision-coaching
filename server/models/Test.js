const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  subject:     { type: String, required: true },
  class:       { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  batch:       { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  testDate:    { type: Date, required: true },
  totalMarks:  { type: Number, default: 100 },
  description: { type: String },
  syllabus:    { type: String },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
