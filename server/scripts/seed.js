const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Drive = require('../models/Drive');
const Registration = require('../models/Registration');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully.');

    // Clear existing records
    console.log('Clearing old collections...');
    await User.deleteMany({});
    await Drive.deleteMany({});
    await Registration.deleteMany({});
    console.log('Collections cleared.');

    // Seed Admin
    console.log('Creating Admin account...');
    const admin = await User.create({
      name: 'Placement cell Head',
      email: 'admin@college.edu',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`Admin created: ${admin.email}`);

    // Seed Students
    console.log('Creating Student accounts...');
    const students = await User.create([
      {
        name: 'Aarav Sharma',
        email: 'aarav@college.edu',
        password: 'student123',
        role: 'student',
        branch: 'CSE',
        cgpa: 9.20,
        backlogs: 0,
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya@college.edu',
        password: 'student123',
        role: 'student',
        branch: 'ECE',
        cgpa: 7.80,
        backlogs: 1,
      },
      {
        name: 'Rohan Verma',
        email: 'rohan@college.edu',
        password: 'student123',
        role: 'student',
        branch: 'MECH',
        cgpa: 6.50,
        backlogs: 0,
      },
      {
        name: 'Kabir Singh',
        email: 'kabir@college.edu',
        password: 'student123',
        role: 'student',
        branch: 'CIVIL',
        cgpa: 5.80,
        backlogs: 3,
      },
    ]);
    console.log(`Created ${students.length} student accounts.`);

    // Seed Drives
    console.log('Creating Placement Drives...');
    const drivesData = [
      {
        companyName: 'Google',
        role: 'Software Engineer',
        packageLPA: 22.0,
        eligibleBranches: ['CSE', 'ECE'],
        minCGPA: 8.50,
        maxBacklogs: 0,
        driveDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days away
        description: 'Join Google as a Software Engineer. Core problem-solving, algorithms, and system design expertise are expected.',
        seatsAvailable: 5,
        createdBy: admin._id,
      },
      {
        companyName: 'TCS Ninja',
        role: 'Systems Engineer',
        packageLPA: 3.6,
        eligibleBranches: ['CSE', 'ECE', 'MECH', 'EEE', 'CIVIL'],
        minCGPA: 6.00,
        maxBacklogs: 2,
        driveDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days away
        description: 'TCS Ninja is a mass recruitment drive for entry-level positions. Standard aptitude and basic coding will be tested.',
        seatsAvailable: 50,
        createdBy: admin._id,
      },
      {
        companyName: 'Infosys',
        role: 'Power Programmer',
        packageLPA: 6.2,
        eligibleBranches: ['CSE', 'ECE', 'EEE'],
        minCGPA: 7.50,
        maxBacklogs: 0,
        driveDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days away
        description: 'Power Programmer role in Infosys focusing on backend architecture and complex programming models.',
        seatsAvailable: 15,
        createdBy: admin._id,
      },
      {
        companyName: 'Wipro Turbo',
        role: 'Project Engineer',
        packageLPA: 6.5,
        eligibleBranches: ['CSE', 'ECE'],
        minCGPA: 7.00,
        maxBacklogs: 1,
        driveDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days away
        description: 'Advanced development track at Wipro. Covers cloud architecture, web applications, and database administration.',
        seatsAvailable: 20,
        createdBy: admin._id,
      },
      {
        companyName: 'Capgemini',
        role: 'Analyst',
        packageLPA: 4.0,
        eligibleBranches: ['CSE', 'ECE', 'EEE'],
        minCGPA: 6.50,
        maxBacklogs: 1,
        driveDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days away
        description: 'Consultant/Analyst hiring for global business client service support. Standard coding round + behavioral interview.',
        seatsAvailable: 25,
        createdBy: admin._id,
      },
      {
        companyName: 'Cognizant GenC Elevate',
        role: 'Software Engineer',
        packageLPA: 4.5,
        eligibleBranches: ['CSE', 'ECE'],
        minCGPA: 6.50,
        maxBacklogs: 0,
        driveDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days away
        description: 'Cognizant recruitment for students with premium development capabilities. (Demo: Zero seats remaining)',
        seatsAvailable: 0, // 0 seats left to test seatsAvailable exhaustion logic
        createdBy: admin._id,
      },
    ];

    const seededDrives = await Drive.create(drivesData);
    console.log(`Created ${seededDrives.length} placement drives.`);

    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
