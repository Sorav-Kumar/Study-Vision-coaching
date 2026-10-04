const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  coachingName:  { type: String, default: 'Study Vision Coaching Centre' },
  tagline:       { type: String, default: 'Learn Better • Build Strong Concepts • Achieve More' },
  aboutContent:  { type: String },
  phone:         { type: String, default: '9354024459' },
  address:       { type: String },
  instagram:     { type: String },
  googleMaps:    { type: String },
  footerText:    { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
