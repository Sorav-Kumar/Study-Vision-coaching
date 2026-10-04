const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true },
  phone:    { type: String },
  email:    { type: String },
  subject:  { type: String },
  bio:      { type: String },
  photoUrl: { type: String },
  status:   { type: String, enum: ['ACTIVE','INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
