const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');

exports.listStudents = asyncHandler(async (filters = {}) => {
  return Student.find(filters).populate('class batch course').sort({ createdAt: -1 });
});

exports.getStudent = asyncHandler(async (id) => {
  const student = await Student.findById(id).populate('class batch course');
  if (!student) throw new AppError('Student not found', 404);
  return student;
});

exports.createStudent = asyncHandler(async (data) => {
  let user = null;
  if (data.email && data.password) {
    user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.parentPhone,
      role: 'STUDENT',
    });
  }
  const student = await Student.create({ ...data, user: user?._id });
  return student;
});

exports.updateStudent = asyncHandler(async (id, data) => {
  const student = await Student.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!student) throw new AppError('Student not found', 404);
  return student;
});

exports.deleteStudent = asyncHandler(async (id) => {
  const student = await Student.findByIdAndDelete(id);
  if (!student) throw new AppError('Student not found', 404);
  return student;
});

exports.listTeachers = asyncHandler(async () => {
  return Teacher.find().sort({ createdAt: -1 });
});

exports.getTeacher = asyncHandler(async (id) => {
  const teacher = await Teacher.findById(id);
  if (!teacher) throw new AppError('Teacher not found', 404);
  return teacher;
});

exports.createTeacher = asyncHandler(async (data) => {
  let user = null;
  if (data.email && data.password) {
    user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: 'TEACHER',
    });
  }
  const teacher = await Teacher.create({ ...data, user: user?._id });
  return teacher;
});

exports.updateTeacher = asyncHandler(async (id, data) => {
  const teacher = await Teacher.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!teacher) throw new AppError('Teacher not found', 404);
  return teacher;
});

exports.deleteTeacher = asyncHandler(async (id) => {
  const teacher = await Teacher.findByIdAndDelete(id);
  if (!teacher) throw new AppError('Teacher not found', 404);
  return teacher;
});

exports.listParents = asyncHandler(async () => {
  return Parent.find().populate('students').sort({ createdAt: -1 });
});

exports.createParent = asyncHandler(async (data) => {
  let user = null;
  if (data.email && data.password) {
    user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: 'PARENT',
    });
  }
  const parent = await Parent.create({ ...data, user: user?._id });
  return parent;
});
