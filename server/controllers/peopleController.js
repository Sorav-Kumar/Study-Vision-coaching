const peopleService = require('../services/peopleService');

exports.listStudents = async (req, res, next) => {
  try {
    const students = await peopleService.listStudents(req.query);
    res.json(students);
  } catch (err) { next(err); }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await peopleService.getStudent(req.params.id);
    res.json(student);
  } catch (err) { next(err); }
};

exports.createStudent = async (req, res, next) => {
  try {
    const student = await peopleService.createStudent(req.body);
    res.status(201).json(student);
  } catch (err) { next(err); }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const student = await peopleService.updateStudent(req.params.id, req.body);
    res.json(student);
  } catch (err) { next(err); }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    await peopleService.deleteStudent(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) { next(err); }
};

exports.listTeachers = async (req, res, next) => {
  try {
    const teachers = await peopleService.listTeachers();
    res.json(teachers);
  } catch (err) { next(err); }
};

exports.getTeacher = async (req, res, next) => {
  try {
    const teacher = await peopleService.getTeacher(req.params.id);
    res.json(teacher);
  } catch (err) { next(err); }
};

exports.createTeacher = async (req, res, next) => {
  try {
    const teacher = await peopleService.createTeacher(req.body);
    res.status(201).json(teacher);
  } catch (err) { next(err); }
};

exports.updateTeacher = async (req, res, next) => {
  try {
    const teacher = await peopleService.updateTeacher(req.params.id, req.body);
    res.json(teacher);
  } catch (err) { next(err); }
};

exports.deleteTeacher = async (req, res, next) => {
  try {
    await peopleService.deleteTeacher(req.params.id);
    res.json({ message: 'Teacher deleted' });
  } catch (err) { next(err); }
};

exports.listParents = async (req, res, next) => {
  try {
    const parents = await peopleService.listParents();
    res.json(parents);
  } catch (err) { next(err); }
};

exports.createParent = async (req, res, next) => {
  try {
    const parent = await peopleService.createParent(req.body);
    res.status(201).json(parent);
  } catch (err) { next(err); }
};
