const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');

// POST /api/auth/register or /signup
router.post(['/register', '/signup'], async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    // Check for existing email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user (bcrypt hook runs on save)
    const user = new User({ name, email, password, phone, city });
    await user.save();

    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Explicitly include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        totalComplaints: user.totalComplaints
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/me (protected)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
});

// PUT /api/auth/profile (protected)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, city } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name)  user.name  = name;
    if (phone) user.phone = phone;
    if (city)  user.city  = city;

    await user.save();

    const updated = await User.findById(user._id).select('-password');
    return res.status(200).json({ message: 'Profile updated', user: updated });
  } catch (error) {
    console.error('Update profile error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
