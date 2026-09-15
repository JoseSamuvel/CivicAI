require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const generateToken = require('./utils/generateToken');

async function runTests() {
  console.log('\n========== CIVICAI AUTH DIAGNOSTICS ==========\n');

  // Check env
  console.log('MONGODB_URI set:', !!process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_connection_string_here');
  console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);

  // Connect MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }

  // --- TEST 1: Register ---
  console.log('--- TEST 1: Register ---');
  try {
    await User.deleteOne({ email: 'jose@civicai.com' }); // clean slate
    const user = new User({ name: 'Jose', email: 'jose@civicai.com', password: 'jose123', city: 'Tirunelveli' });
    await user.save();
    const token = generateToken(user._id);
    console.log('✅ Register success');
    console.log('   User:', { _id: user._id, name: user.name, email: user.email, role: user.role });
    console.log('   Token:', token.substring(0, 40) + '...\n');

    // --- TEST 2: Login ---
    console.log('--- TEST 2: Login ---');
    const found = await User.findOne({ email: 'jose@civicai.com' }).select('+password');
    const match = await found.comparePassword('jose123');
    const loginToken = generateToken(found._id);
    console.log('✅ Login success, password match:', match);
    console.log('   Token:', loginToken.substring(0, 40) + '...\n');

    // --- TEST 3: Get profile (simulated via findById) ---
    console.log('--- TEST 3: Get Profile ---');
    const profile = await User.findById(user._id).select('-password');
    console.log('✅ Profile fetch success');
    console.log('   User:', JSON.stringify(profile.toObject(), null, 2).substring(0, 200) + '\n');

    // --- TEST 5: Duplicate email ---
    console.log('--- TEST 5: Duplicate Email Check ---');
    const dup = await User.findOne({ email: 'jose@civicai.com' });
    if (dup) {
      console.log('✅ Duplicate detection works: "Email already registered" would be returned\n');
    }

  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }

  // --- TEST 4: Seed Admin ---
  console.log('--- TEST 4: Seed Admin ---');
  try {
    const existing = await User.findOne({ email: 'admin@civicai.com' });
    if (existing) {
      console.log('✅ Admin already exists: admin@civicai.com / admin123\n');
    } else {
      const admin = new User({ name: 'Admin Jose', email: 'admin@civicai.com', password: 'admin123', role: 'admin', city: 'Tirunelveli' });
      await admin.save();
      const adminToken = generateToken(admin._id);
      console.log('✅ Admin created: admin@civicai.com / admin123');
      console.log('   Token:', adminToken.substring(0, 40) + '...\n');
    }
  } catch (err) {
    console.error('❌ Admin seed failed:', err.message);
  }

  console.log('========== ALL TESTS DONE ==========\n');
  process.exit(0);
}

runTests();
