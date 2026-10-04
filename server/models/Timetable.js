const mongoose = require('mongoose';

const timetableSchema = new mongoose.Schema({
  day:       { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], required: true },
  date:      { type: Date },
  startTime: { type: String, required: true },
  endTime:   { type: String, required: true },
  subject:   { type: String, required: true },
  teacher:   { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  class:     { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  batch:     { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  room:      { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
