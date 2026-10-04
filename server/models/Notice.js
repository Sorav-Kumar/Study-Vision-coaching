const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  target:    { type: String, enum: ['ALL','CLASS','BATCH','SELECTED'], default: 'ALL' },
  class:     { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  batch:     { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
