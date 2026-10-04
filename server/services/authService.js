const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const { generateToken } = require('../utils/jwt');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');

exports.login = asyncHandler(async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Invalid credentials', 401);
  if (!user.isActive) throw new AppError('Account is inactive', 403);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;

  let profile = null;
  if (user.role === 'TEACHER') {
    profile = await Teacher.findOne({ user: user._id });
  } else if (user.role === 'STUDENT') {
    profile = await Student.findOne({ user: user._id }).populate('class batch');
  } else if (user.role === 'PARENT') {
    profile = await Parent.findOne({ user: user._id }).populate('students');
  }

  return { user: userObj, profile, token };
});

exports.register = asyncHandler(async (userData) => {
  const user = await User.create(userData);
  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
});

exports.getMe = asyncHandler(async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  let profile = null;
  if (user.role === 'TEACHER') {
    profile = await Teacher.findOne({ user: user._id });
  } else if (user.role === 'STUDENT') {
    profile = await Student.findOne({ user: user._id }).populate('class batch');
  } else if (user.role === 'PARENT') {
    profile = await Parent.findOne({ user: user._id }).populate('students');
  }
  return { user, profile };
});
