const express = require('express');
const multer = require('multer');
const path = require('path');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const aiService = require('../services/aiService');
const emailService = require('../services/emailService');

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST /api/complaints/create or POST /api/complaints/ (protected)
router.post(['/', '/create'], protect, upload.single('image'), async (req, res) => {
  try {
    const { issueType, description, location } = req.body;
    let parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    const hasImage = !!req.file;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Call AI to generate complaint metadata
    const aiData = await aiService.generateComplaint(issueType, description, parsedLocation, hasImage);

    const newComplaint = new Complaint({
      userId: req.user._id,
      complaintId: aiData.complaintId,
      issueType,
      description,
      location: parsedLocation,
      imageUrl,
      status: 'pending',
      priorityLevel: aiData.priorityLevel,
      authorityName: aiData.authorityName,
      authorityEmail: aiData.authorityEmail,
      aiGeneratedComplaint: aiData.complaintText,
      referenceNumber: aiData.referenceNumber,
      actionTimeline: aiData.actionTimeline
    });

    const savedComplaint = await newComplaint.save();

    const user = await User.findById(req.user._id);
    if (user && user.email) {
      emailService.sendComplaintEmail(savedComplaint, user.email);
    }

    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error('Create Complaint Error:', error);
    res.status(500).json({ message: 'Server error generating complaint' });
  }
});

// GET /api/complaints/all (Admin only)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json(complaints);
  } catch (error) {
    console.error('Fetch All Complaints Error:', error);
    res.status(500).json({ message: 'Server error returning complaints' });
  }
});

// GET /api/complaints/my (protected)
router.get('/my', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Fetch My Complaints Error:', error);
    res.status(500).json({ message: 'Server error returning complaints' });
  }
});

// GET /api/complaints/:id (protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    console.error('Fetch Single Complaint Error:', error);
    res.status(500).json({ message: 'Server error returning complaint' });
  }
});

// PATCH /api/complaints/:id/status or /update-status (Admin only)
router.patch(['/:id/status', '/update-status'], protect, adminOnly, async (req, res) => {
  try {
    const { id, status } = req.body;
    const complaintId = req.params.id || id;
    
    if (!complaintId) {
      return res.status(400).json({ message: 'Complaint ID is required' });
    }

    let updateFields = { status };

    if (status === 'resolved') {
      updateFields.resolvedAt = Date.now();
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(updatedComplaint);
  } catch (error) {
    console.error('Update Complaint Status Error:', error);
    res.status(500).json({ message: 'Server error updating complaint' });
  }
});

// DELETE /api/complaints/:id (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Only owner or admin can delete
    if (complaint.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this complaint' });
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Delete Complaint Error:', error);
    res.status(500).json({ message: 'Server error deleting complaint' });
  }
});

module.exports = router;
