require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'your_mongodb_connection_string_here') {
      console.log('ERROR: Set a valid MONGODB_URI in server/.env before seeding.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const existing = await User.findOne({ email: 'admin@civicai.com' });
    if (existing) {
      console.log('Admin already exists');
    } else {
      const admin = new User({
        name: 'Admin Jose',
        email: 'admin@civicai.com',
        password: 'admin123',
        role: 'admin',
        city: 'Tirunelveli'
      });
      await admin.save();
      console.log('Admin user created: admin@civicai.com / admin123');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
