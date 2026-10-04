const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  subject:     { type: String },
  class:       { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  batch:       { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  accessLevel: { type: String, enum: ['PUBLIC','CLASS','BATCH','SELECTED'], default: 'PUBLIC' },
  filePath:    { type: String, required: true },
  fileName:    { type: String, required: true },
  fileSize:    { type: Number },
  uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
