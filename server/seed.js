require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/User');
const Class = require('./models/Class');
const Course = require('./models/Course');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const Parent = require('./models/Parent');
const Batch = require('./models/Batch');
const Faculty = require('./models/Faculty');
const Gallery = require('./models/Gallery');
const Settings = require('./models/Settings');
const Enquiry = require('./models/Enquiry');
const Notice = require('./models/Notice');

async function seed() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB, seeding...');

    await Promise.all([
      User.deleteMany({}),
      Class.deleteMany({}),
      Course.deleteMany({}),
      Teacher.deleteMany({}),
      Student.deleteMany({}),
      Parent.deleteMany({}),
      Batch.deleteMany({}),
      Faculty.deleteMany({}),
      Gallery.deleteMany({}),
      Settings.deleteMany({}),
      Enquiry.deleteMany({}),
      Notice.deleteMany({}),
    ]);

    // Admin user
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@studyvision.com',
      password: 'password123',
      role: 'ADMIN',
      phone: '9354024459',
    });

    // Teacher user + profile
    const teacherUser = await User.create({
      fullName: 'Shashank Sir',
      email: 'shashank@studyvision.com',
      password: 'password123',
      role: 'TEACHER',
      phone: '9354024459',
    });
    const teacher = await Teacher.create({
      user: teacherUser._id,
      fullName: 'Shashank Sir',
      subject: 'Mathematics',
      bio: 'Focused on concept clarity, problem-solving and exam-oriented preparation.',
      phone: '9354024459',
      email: 'shashank@studyvision.com',
    });

    // Classes
    const classes = [];
    for (let i = 1; i <= 12; i++) {
      classes.push(await Class.create({ name: `Class ${i}`, level: i }));
    }

    // Courses
    const courses = [
      { name: 'Classes 1st - 5th', description: 'Primary foundation program', classRange: '1st-5th', stream: 'Primary', features: ['All Major Subjects','Basic Concept Building','Regular Practice','Homework & Revision'], displayOrder: 1 },
      { name: 'Classes 6th - 8th', description: 'Middle school program', classRange: '6th-8th', stream: 'Middle', features: ['All Major Subjects','Concept-Based Learning','Regular Tests','Doubt Clearing'], displayOrder: 2 },
      { name: 'Classes 9th - 10th', description: 'Secondary board exam prep', classRange: '9th-10th', stream: 'Secondary', features: ['Mathematics','Science','Social Science','Board Exam Prep'], displayOrder: 3 },
      { name: 'Science Stream (11th-12th)', description: 'Science stream coaching', classRange: '11th-12th', stream: 'Science', features: ['Physics','Chemistry','Mathematics/Biology','Board Exam Prep'], displayOrder: 4 },
      { name: 'Commerce Stream (11th-12th)', description: 'Commerce stream coaching', classRange: '11th-12th', stream: 'Commerce', features: ['Accountancy','Business Studies','Economics','Board Exam Prep'], displayOrder: 5 },
      { name: 'Arts/Humanities (11th-12th)', description: 'Humanities stream coaching', classRange: '11th-12th', stream: 'Arts', features: ['History','Political Science','Geography','Board Exam Prep'], displayOrder: 6 },
    ];
    for (const c of courses) await Course.create(c);

    // Batch
    const batch = await Batch.create({
      name: 'Batch A - Class 10',
      class: classes[9]._id,
      teacher: teacher._id,
      academicYear: '2026',
      schedule: 'Mon-Sat, 4:00 PM - 6:00 PM',
    });

    // Student user + profile
    const studentUser = await User.create({
      fullName: 'Demo Student',
      email: 'student@studyvision.com',
      password: 'password123',
      role: 'STUDENT',
      phone: '9876543210',
    });
    const student = await Student.create({
      user: studentUser._id,
      fullName: 'Demo Student',
      class: classes[9]._id,
      batch: batch._id,
      parentName: 'Demo Parent',
      parentPhone: '9876543210',
      schoolName: 'Demo School',
      status: 'ACTIVE',
    });

    // Parent user + profile
    const parentUser = await User.create({
      fullName: 'Demo Parent',
      email: 'parent@studyvision.com',
      password: 'password123',
      role: 'PARENT',
      phone: '9876543210',
    });
    await Parent.create({
      user: parentUser._id,
      fullName: 'Demo Parent',
      phone: '9876543210',
      students: [student._id],
    });

    // Faculty
    await Faculty.create({
      name: 'Shashank Sir',
      subject: 'Mathematics',
      bio: 'Focused on concept clarity, problem-solving and exam-oriented preparation.',
      displayOrder: 1,
    });

    // Gallery
    const galleryItems = [
      { title: 'Classroom Learning', category: 'Classroom Activities', imageUrl: 'https://images.pexels.com/photos/8617715/pexels-photo-8617715.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { title: 'Teaching Session', category: 'Teaching Sessions', imageUrl: 'https://images.pexels.com/photos/8978622/pexels-photo-8978622.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { title: 'Exam Time', category: 'Test & Examination', imageUrl: 'https://images.pexels.com/photos/6147097/pexels-photo-6147097.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { title: 'Student Focus', category: 'Student Activities', imageUrl: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { title: 'Group Study', category: 'Classroom Activities', imageUrl: 'https://images.pexels.com/photos/8423025/pexels-photo-8423025.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
      { title: 'Writing Notes', category: 'Teaching Sessions', imageUrl: 'https://images.pexels.com/photos/8423050/pexels-photo-8423050.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
    ];
    await Gallery.insertMany(galleryItems);

    // Settings
    await Settings.create({
      coachingName: 'Study Vision Coaching Centre',
      tagline: 'Learn Better • Build Strong Concepts • Achieve More',
      aboutContent: 'Study Vision Coaching Centre is dedicated to providing quality education in a supportive and disciplined learning environment. We focus on concept clarity, regular practice, doubt solving and exam preparation.',
      phone: '9354024459',
      address: 'Study Vision Coaching Centre',
      instagram: '@studyvisioncoaching',
      footerText: 'Where Learning Meets Success.',
    });

    // Sample notices
    await Notice.create(
      { title: 'Welcome to Study Vision', content: 'Admissions open for all classes. Limited seats available.', target: 'ALL', createdBy: admin._id },
      { title: 'Unit Test Schedule', content: 'Unit tests for Class 10 will begin next week.', target: 'BATCH', batch: batch._id, createdBy: admin._id },
    );

    console.log('Seed completed successfully!');
    console.log('Login credentials:');
    console.log('  Admin:    admin@studyvision.com / password123');
    console.log('  Teacher:  shashank@studyvision.com / password123');
    console.log('  Student:  student@studyvision.com / password123');
    console.log('  Parent:   parent@studyvision.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
