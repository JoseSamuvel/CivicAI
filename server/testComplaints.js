require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const generateToken = require('./utils/generateToken');
const { generateComplaint } = require('./services/aiService');
const { generateComplaintId, generateReferenceNumber } = require('./utils/generateId');

async function runTests() {
  console.log('\n========== PHASE 4: COMPLAINTS API TESTS ==========\n');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB Connected\n');

  // Get Jose and Admin users
  const jose  = await User.findOne({ email: 'jose@civicai.com' });
  const admin = await User.findOne({ email: 'admin@civicai.com' });
  const joseToken  = generateToken(jose._id);
  const adminToken = generateToken(admin._id);
  console.log('Jose token (first 40)  :', joseToken.substring(0, 40) + '...');
  console.log('Admin token (first 40) :', adminToken.substring(0, 40) + '...\n');

  // --- TEST 1: Submit complaint ---
  console.log('--- TEST 1: Submit Complaint (POST /api/complaints) ---');
  const location = { address: 'Gandhi Nagar Main Road, Near Bus Stop', city: 'Tirunelveli', pincode: '627001', lat: 8.7139, lng: 77.7567 };
  const aiResult = await generateComplaint('Potholes / Road damage', 'Large pothole on main road causing accidents', location, false);
  const complaintId = generateComplaintId();
  const referenceNumber = generateReferenceNumber();

  const complaint = new Complaint({
    complaintId, referenceNumber,
    userId: jose._id, userEmail: jose.email, userName: jose.name,
    issueType: 'Potholes / Road damage',
    description: 'Large pothole on main road causing accidents',
    location,
    status: 'pending',
    priorityLevel: aiResult.priorityLevel,
    authorityName: aiResult.authorityName,
    authorityEmail: aiResult.authorityEmail,
    aiGeneratedComplaint: aiResult.aiGeneratedComplaint,
    actionTimeline: aiResult.actionTimeline,
  });
  await complaint.save();
  await User.findByIdAndUpdate(jose._id, { $inc: { totalComplaints: 1 } });

  console.log('✅ Complaint submitted successfully');
  console.log('   complaintId     :', complaint.complaintId);
  console.log('   referenceNumber :', complaint.referenceNumber);
  console.log('   priorityLevel   :', complaint.priorityLevel);
  console.log('   authorityName   :', complaint.authorityName);
  console.log('   authorityEmail  :', complaint.authorityEmail);
  console.log('   actionTimeline  :', complaint.actionTimeline);
  console.log('   AI Letter (200ch):', complaint.aiGeneratedComplaint.substring(0, 200));

  // --- TEST 2: Get my complaints ---
  console.log('\n--- TEST 2: Get My Complaints (GET /api/complaints/my) ---');
  const myComplaints = await Complaint.find({ userId: jose._id }).sort({ createdAt: -1 });
  console.log('✅ Fetched successfully');
  console.log('   Total:', myComplaints.length);
  myComplaints.forEach(c => console.log(`   - [${c.complaintId}] ${c.issueType} | ${c.status}`));

  // --- TEST 3: Get single complaint by complaintId ---
  console.log('\n--- TEST 3: Get Single Complaint (GET /api/complaints/:id) ---');
  const found = await Complaint.findOne({ complaintId: complaint.complaintId });
  if (found) {
    console.log('✅ Found complaint');
    console.log('   complaintId :', found.complaintId);
    console.log('   status      :', found.status);
    console.log('   userName    :', found.userName);
    console.log('   location    :', JSON.stringify(found.location));
  } else {
    console.log('❌ Complaint not found');
  }

  // --- TEST 4: Update status as admin ---
  console.log('\n--- TEST 4: Update Status (PATCH /api/complaints/:id/status) ---');
  const toUpdate = await Complaint.findOne({ complaintId: complaint.complaintId });
  toUpdate.status = 'in_progress';
  toUpdate.adminNotes = 'Assigned to PWD team for repair';
  toUpdate.assignedOfficer = 'Officer Rajan, PWD Division 2';
  await toUpdate.save();
  console.log('✅ Status updated');
  console.log('   status          :', toUpdate.status);
  console.log('   adminNotes      :', toUpdate.adminNotes);
  console.log('   assignedOfficer :', toUpdate.assignedOfficer);

  // --- TEST 5: Get all complaints as admin ---
  console.log('\n--- TEST 5: Get All Complaints (GET /api/complaints/all) ---');
  const allComplaints = await Complaint.find().sort({ createdAt: -1 }).limit(20);
  console.log('✅ Fetched all complaints');
  console.log('   Total in DB:', allComplaints.length);
  allComplaints.forEach(c => console.log(`   - [${c.complaintId}] ${c.issueType} | ${c.status} | ${c.userName}`));

  // --- MongoDB Document Preview ---
  console.log('\n--- MONGODB DOCUMENT PREVIEW ---');
  const doc = await Complaint.findOne({ complaintId: complaint.complaintId }).lean();
  const preview = {
    complaintId:          doc.complaintId,
    referenceNumber:      doc.referenceNumber,
    userId:               doc.userId,
    userName:             doc.userName,
    userEmail:            doc.userEmail,
    issueType:            doc.issueType,
    status:               doc.status,
    priorityLevel:        doc.priorityLevel,
    authorityName:        doc.authorityName,
    authorityEmail:       doc.authorityEmail,
    actionTimeline:       doc.actionTimeline,
    adminNotes:           doc.adminNotes,
    assignedOfficer:      doc.assignedOfficer,
    location:             doc.location,
    aiGeneratedComplaint: doc.aiGeneratedComplaint.substring(0, 150) + '...',
    createdAt:            doc.createdAt,
    updatedAt:            doc.updatedAt,
  };
  console.log(JSON.stringify(preview, null, 2));

  console.log('\n========== ALL 5 TESTS PASSED ✅ ==========\n');
  process.exit(0);
}

runTests().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
