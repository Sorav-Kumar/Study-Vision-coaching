const Enquiry = require('../models/Enquiry');

exports.listEnquiries = async (req, res, next) => {
  try { res.json(await Enquiry.find().sort({ createdAt: -1 })); } catch (err) { next(err); }
};

exports.createEnquiry = async (req, res, next) => {
  try { res.status(201).json(await Enquiry.create(req.body)); } catch (err) { next(err); }
};

exports.updateEnquiry = async (req, res, next) => {
  try { res.json(await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (err) { next(err); }
};

exports.deleteEnquiry = async (req, res, next) => {
  try { await Enquiry.findByIdAndDelete(req.params.id); res.json({ message: 'Enquiry deleted' }); } catch (err) { next(err); }
};
