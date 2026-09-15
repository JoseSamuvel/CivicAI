const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes      = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const adminRoutes     = require('./routes/admin');

app.use('/api/auth',       authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin',      adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CivicAI server running' });
});

// Test models route (temporary diagnostic)
app.get('/test-models', (req, res) => {
  const User      = require('./models/User');
  const Complaint = require('./models/Complaint');
  res.json({
    message: 'Models loaded successfully',
    userFields: Object.keys(User.schema.paths),
    complaintFields: Object.keys(Complaint.schema.paths)
  });
});

// Start Server
const startServer = async () => {
  try {
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_connection_string_here') {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB Connected');
    } else {
      console.log('MongoDB skipped: set MONGODB_URI in server/.env');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`CivicAI server running on port ${PORT}`);
    console.log('Registered routes: /api/auth, /api/complaints, /api/admin');
  });
};

startServer();
