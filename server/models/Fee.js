const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  totalAmount:  { type: Number, required: true, default: 0 },
  paidAmount:  { type: Number, default: 0 },
  discount:    { type: Number, default: 0 },
  dueDate:     { type: Date },
  feeType:     { type: String, default: 'Monthly' },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
