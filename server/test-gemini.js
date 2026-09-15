require('dotenv').config()
const { generateComplaint } = require('./services/aiService')

async function test() {
  console.log('Testing Gemini AI service...')
  console.log('API Key exists:', 
    !!process.env.GEMINI_API_KEY)
  
  const result = await generateComplaint(
    'Potholes / Road damage',
    'Large pothole on Gandhi Nagar main road near the bus stop causing accidents for 3 weeks.',
    {
      address: 'Gandhi Nagar Main Road, Near Bus Stop',
      city: 'Tirunelveli',
      pincode: '627001'
    },
    false
  )
  
  console.log('\n=== GEMINI RESULT ===')
  console.log('Priority:', result.priorityLevel)
  console.log('Authority:', result.authorityName)
  console.log('Email:', result.authorityEmail)
  console.log('Timeline:', result.actionTimeline)
  console.log('\nComplaint Letter:')
  console.log(result.aiGeneratedComplaint)
  console.log('=== END ===')
}

test()
