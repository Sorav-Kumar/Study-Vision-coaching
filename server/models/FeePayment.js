const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  fee:           { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: true },
  receiptNumber: { type: String, required: true },
  amount:        { type: Number, required: true },
  paymentDate:   { type: Date, default: Date.now },
  paymentMethod: { type: String, enum: ['Cash','UPI','Bank Transfer','Other'], default: 'Cash' },
  month:         { type: String },
  notes:         { type: String },
}, { timestamps: true });

module.exports = mongoose.model('FeePayment', feePaymentSchema);
