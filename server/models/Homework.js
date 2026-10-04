const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  subject:     { type: String, required: true },
  class:       { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  batch:       { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  dueDate:     { type: Date, required: true },
  filePath:    { type: String },
  fileName:    { type: String },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Homework', homeworkSchema);
