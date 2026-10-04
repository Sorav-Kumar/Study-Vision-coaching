const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Fee = require('../models/Fee');
const Test = require('../models/Test');
const Attendance = require('../models/Attendance');
const Enquiry = require('../models/Enquiry');

exports.getReportSummary = async (req, res, next) => {
  try {
    const [students, teachers, fees, tests, attendance, enquiries] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Fee.find(),
      Test.countDocuments(),
      Attendance.find(),
      Enquiry.countDocuments(),
    ]);
    const totalFees = fees.reduce((s, f) => s + (f.totalAmount || 0), 0);
    const paidFees = fees.reduce((s, f) => s + (f.paidAmount || 0), 0);
    const pendingFees = totalFees - paidFees;
    const present = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const attendanceRate = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0;

    res.json({ students, teachers, totalFees, paidFees, pendingFees, tests, attendanceRate, enquiries });
  } catch (err) { next(err); }
};
