const { GoogleGenerativeAI } = require('@google/generative-ai')
const { AUTHORITY_MAP } = require('../utils/authorityMap')

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
)

async function generateComplaint(
  issueType, description, location, hasImage
) {
  // Get authority from map
  const authority = AUTHORITY_MAP[issueType] || {
    name: 'Tirunelveli Municipal Corporation',
    email: 'commissioner.tvm@tn.gov.in',
    department: 'Municipal Corporation'
  }

  // Format today's date
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })

  // Build the prompt
  const prompt = `You are a civic complaint officer for 
Indian municipal authorities. Generate a formal complaint.

Issue Type: ${issueType}
Location: ${location.address || ''}, 
          ${location.city || 'Tirunelveli'} - 
          ${location.pincode || '627001'}, Tamil Nadu
Description: ${description || 
  'The issue requires immediate attention.'}
Reported Date: ${dateStr}
Image Provided: ${hasImage ? 'Yes' : 'No'}
Authority: ${authority.name}

Priority Rules:
- High: flooding, sewage overflow, power outage, 
        water contamination, road collapse
- Medium: pothole, streetlight, garbage, water shortage  
- Low: stray animals, broken bench, transport

Return ONLY this exact JSON (no markdown, no backticks, 
no extra text):
{
  "priorityLevel": "High or Medium or Low",
  "complaintText": "Write a formal 200-250 word complaint letter. Format: To, The [authority name], [city]. Subject: [clear subject line]. Sir/Madam, [Paragraph 1: introduce as a resident and state the issue clearly]. [Paragraph 2: describe impact on public and duration]. [Paragraph 3: request immediate action and mention urgency]. Yours faithfully, Complainant.",
  "actionTimeline": "e.g. 3-5 working days",
  "suggestedDepartment": "${authority.department}"
}`

  try {
    // Use Gemini 1.5 Flash (free tier, fast)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash'
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const raw = response.text()

    // Clean any markdown if present
    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const parsed = JSON.parse(cleaned)

    return {
      priorityLevel: parsed.priorityLevel || 'Medium',
      authorityName: authority.name,
      authorityEmail: authority.email,
      aiGeneratedComplaint: parsed.complaintText || '',
      actionTimeline: parsed.actionTimeline || 
        '5-7 working days',
    }

  } catch (error) {
    console.error('Gemini API error:', error.message)

    // Fallback if API fails
    return {
      priorityLevel: 'Medium',
      authorityName: authority.name,
      authorityEmail: authority.email,
      aiGeneratedComplaint: 
        `To,
The ${authority.name},
${location.city || 'Tirunelveli'}, Tamil Nadu.

Subject: Complaint Regarding ${issueType} at 
${location.address || 'the mentioned location'}

Sir/Madam,

I, a resident of ${location.city || 'Tirunelveli'}, 
wish to bring to your attention the issue of 
${issueType.toLowerCase()} at 
${location.address || 'the mentioned location'}, 
${location.city || 'Tirunelveli'} - 
${location.pincode || '627001'}.

${description || 'This issue has been persisting and is causing significant inconvenience to the public. Immediate attention is required to resolve this problem.'}

I kindly request your office to take immediate action 
to address this issue at the earliest. 
The same is causing hardship to the residents of the area.

Yours faithfully,
Complainant
Date: ${dateStr}`,
      actionTimeline: '5-7 working days',
    }
  }
}

module.exports = { generateComplaint }
