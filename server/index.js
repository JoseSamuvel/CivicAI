const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://civic-ai-three-tau.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.options(/.*/, cors()); // Handle preflight for all routes (Express 5 compatible)
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
