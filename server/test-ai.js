require('dotenv').config();
const { generateComplaint } = require('./services/aiService');

async function test() {
  console.log('\n========== CLAUDE AI SERVICE TEST ==========\n');
  console.log('Testing with: Potholes / Road damage\n');

  const result = await generateComplaint(
    'Potholes / Road damage',
    'There is a large pothole on Gandhi Nagar main road near the bus stop. It has been there for 3 weeks and has caused 2 accidents.',
    {
      address: 'Gandhi Nagar Main Road, Near Bus Stop',
      city: 'Tirunelveli',
      pincode: '627001'
    },
    false
  );

  console.log('Priority:   ', result.priorityLevel);
  console.log('Authority:  ', result.authorityName);
  console.log('Email:      ', result.authorityEmail);
  console.log('Timeline:   ', result.actionTimeline);
  console.log('\n--- Letter Preview (first 300 chars) ---');
  console.log(result.aiGeneratedComplaint.substring(0, 300));
  console.log('\n========== TEST COMPLETE ==========\n');
}

test();
