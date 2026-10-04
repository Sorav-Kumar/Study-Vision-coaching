const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  description:  { type: String },
  classRange:   { type: String },
  stream:       { type: String },
  features:     [{ type: String }],
  displayOrder: { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
