import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/User';
import { env } from './config/env';

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users to prevent duplicates if run multiple times
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const admin = new User({
      email: 'admin@vaultpay.com',
      passwordHash,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
    });

    const client = new User({
      email: 'client@company.com',
      passwordHash,
      role: 'CLIENT',
      firstName: 'John',
      lastName: 'Doe',
      companyName: 'Acme Corp',
    });

    await admin.save();
    await client.save();

    console.log('✅ Database seeded successfully with Admin and Client users');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
