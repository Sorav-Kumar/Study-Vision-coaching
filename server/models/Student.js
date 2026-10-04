const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  studentId:     { type: String, unique: true, sparse: true },
  fullName:      { type: String, required: true },
  dateOfBirth:   { type: Date },
  gender:        { type: String, enum: ['Male','Female','Other'] },
  photoUrl:      { type: String },
  parentName:    { type: String },
  parentPhone:   { type: String },
  alternatePhone:{ type: String },
  email:         { type: String },
  address:       { type: String },
  schoolName:    { type: String },
  class:         { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  course:        { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  batch:         { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  admissionDate: { type: Date, default: Date.now },
  status:        { type: String, enum: ['ACTIVE','INACTIVE','GRADUATED','LEFT'], default: 'ACTIVE' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
