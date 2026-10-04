const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  studentName:    { type: String, required: true },
  parentName:     { type: String, required: true },
  mobile:         { type: String, required: true },
  email:          { type: String },
  className:      { type: String },
  courseStream:   { type: String },
  preferredBatch: { type: String },
  message:        { type: String },
  status:         { type: String, enum: ['New','Contacted','Interested','Admitted','Not Interested'], default: 'New' },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
