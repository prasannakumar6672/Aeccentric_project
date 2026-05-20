import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

dotenv.config({ path: '../../.env' }); // Adjust if needed

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/aeccentric-ems', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to DB');

    // Create Admin
    const adminUser = await User.create({
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      isVerified: true
    });
    
    await Employee.create({
      userId: adminUser._id,
      fullName: 'Admin User',
      department: 'Management'
    });

    // Create Employee
    const empUser = await User.create({
      email: 'employee@test.com',
      password: 'password123',
      role: 'employee',
      isVerified: true
    });
    
    await Employee.create({
      userId: empUser._id,
      fullName: 'Test Employee',
      department: 'Engineering'
    });

    console.log('Users seeded successfully:');
    console.log('Admin -> admin@test.com / password123');
    console.log('Employee -> employee@test.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
