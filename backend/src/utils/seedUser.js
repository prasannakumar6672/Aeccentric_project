import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

dotenv.config({ path: '../../.env' }); // Adjust if needed

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is required to seed users.');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
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
      fullName: 'Sravan Kumar',
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
