require('dotenv').config();
const { generateComplaint } = require('./services/aiService');

async function test() {
  console.log('Testing generateComplaint with sample Pothole data...');
  
  const sampleLocation = {
    lat: 19.0760,
    lng: 72.8777,
    address: 'Near Dadar Station, Senapati Bapat Marg',
    city: 'Mumbai'
  };

  try {
    const result = await generateComplaint(
      'Pothole',
      'There is a massive pothole in the middle of the road causing huge traffic jams and damage to vehicles.',
      sampleLocation,
      true
    );
    console.log('\nSuccess! Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('\nTest Failed:', error.message);
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('NOTE: You need to add a valid ANTHROPIC_API_KEY to your .env file before the API call can succeed.');
    }
  }
}

test();
