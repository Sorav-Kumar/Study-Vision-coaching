const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name:  { type: String, required: true, unique: true },
  level: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
