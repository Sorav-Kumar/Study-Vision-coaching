const noteService = require('../services/noteService');

exports.listNotes = async (req, res, next) => {
  try { res.json(await noteService.listNotes(req.user)); } catch (err) { next(err); }
};
exports.getNote = async (req, res, next) => {
  try { res.json(await noteService.getNote(req.params.id, req.user)); } catch (err) { next(err); }
};
exports.createNote = async (req, res, next) => {
  try { res.status(201).json(await noteService.createNote(req.body, req.user)); } catch (err) { next(err); }
};
exports.updateNote = async (req, res, next) => {
  try { res.json(await noteService.updateNote(req.params.id, req.body)); } catch (err) { next(err); }
};
exports.deleteNote = async (req, res, next) => {
  try { await noteService.deleteNote(req.params.id); res.json({ message: 'Note deleted' }); } catch (err) { next(err); }
};
