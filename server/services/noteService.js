const Note = require('../models/Note');
const Student = require('../models/Student');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');

exports.listNotes = asyncHandler(async (user) => {
  if (user.role === 'ADMIN' || user.role === 'TEACHER') {
    return Note.find().populate('class batch').sort({ createdAt: -1 });
  }
  if (user.role === 'STUDENT') {
    const student = await Student.findOne({ user: user._id });
    if (!student) return [];
    return Note.find({
      $or: [
        { accessLevel: 'PUBLIC' },
        { accessLevel: 'CLASS', class: student.class },
        { accessLevel: 'BATCH', batch: student.batch },
      ],
    }).populate('class batch').sort({ createdAt: -1 });
  }
  if (user.role === 'PARENT') {
    const parent = await Parent.findOne({ user: user._id }).populate('students');
    if (!parent || !parent.students.length) return [];
    const classIds = parent.students.map(s => s.class).filter(Boolean);
    const batchIds = parent.students.map(s => s.batch).filter(Boolean);
    return Note.find({
      $or: [
        { accessLevel: 'PUBLIC' },
        { accessLevel: 'CLASS', class: { $in: classIds } },
        { accessLevel: 'BATCH', batch: { $in: batchIds } },
      ],
    }).populate('class batch').sort({ createdAt: -1 });
  }
  return [];
});

exports.getNote = asyncHandler(async (id, user) => {
  const note = await Note.findById(id).populate('class batch');
  if (!note) throw new AppError('Note not found', 404);
  if (note.accessLevel === 'PUBLIC') return note;
  if (user.role === 'ADMIN' || user.role === 'TEACHER') return note;
  if (user.role === 'STUDENT') {
    const student = await Student.findOne({ user: user._id });
    if (!student) throw new AppError('Not authorized', 403);
    if (note.accessLevel === 'CLASS' && note.class && student.class && note.class._id.equals(student.class)) return note;
    if (note.accessLevel === 'BATCH' && note.batch && student.batch && note.batch._id.equals(student.batch)) return note;
    throw new AppError('Not authorized to view this note', 403);
  }
  throw new AppError('Not authorized', 403);
});

exports.createNote = asyncHandler(async (data, user) => {
  return Note.create({ ...data, uploadedBy: user._id });
});

exports.updateNote = asyncHandler(async (id, data) => {
  const note = await Note.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!note) throw new AppError('Note not found', 404);
  return note;
});

exports.deleteNote = asyncHandler(async (id) => {
  const note = await Note.findByIdAndDelete(id);
  if (!note) throw new AppError('Note not found', 404);
  return note;
});
