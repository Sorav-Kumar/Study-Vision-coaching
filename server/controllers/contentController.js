const Gallery = require('../models/Gallery');
const Faculty = require('../models/Faculty');
const Settings = require('../models/Settings');

exports.listGallery = async (req, res, next) => {
  try { res.json(await Gallery.find().sort({ createdAt: -1 })); } catch (err) { next(err); }
};
exports.createGalleryItem = async (req, res, next) => {
  try { res.status(201).json(await Gallery.create(req.body)); } catch (err) { next(err); }
};
exports.deleteGalleryItem = async (req, res, next) => {
  try { await Gallery.findByIdAndDelete(req.params.id); res.json({ message: 'Gallery item deleted' }); } catch (err) { next(err); }
};

exports.listFaculty = async (req, res, next) => {
  try { res.json(await Faculty.find().sort({ displayOrder: 1 })); } catch (err) { next(err); }
};
exports.createFaculty = async (req, res, next) => {
  try { res.status(201).json(await Faculty.create(req.body)); } catch (err) { next(err); }
};
exports.updateFaculty = async (req, res, next) => {
  try { res.json(await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })); } catch (err) { next(err); }
};
exports.deleteFaculty = async (req, res, next) => {
  try { await Faculty.findByIdAndDelete(req.params.id); res.json({ message: 'Faculty deleted' }); } catch (err) { next(err); }
};

exports.getSettings = async (req, res, next) => {
  try { const s = await Settings.findOne() || {}; res.json(s); } catch (err) { next(err); }
};
exports.updateSettings = async (req, res, next) => {
  try {
    const existing = await Settings.findOne();
    if (existing) {
      res.json(await Settings.findByIdAndUpdate(existing._id, req.body, { new: true, runValidators: true }));
    } else {
      res.status(201).json(await Settings.create(req.body));
    }
  } catch (err) { next(err); }
};
