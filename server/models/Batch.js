const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  class:        { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  course:       { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  teacher:      { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  academicYear: { type: String },
  schedule:     { type: String },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
