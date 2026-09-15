const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

async function sendComplaintEmail(complaint, citizenEmail) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SENDGRID_API_KEY is missing. Skipping email sending.');
      return;
    }

    // 1. Email to Authority
    const authorityMailOptions = {
      from: 'noreply@civicai.org', // Note: Must be verified in your SendGrid account
      to: complaint.authorityEmail,
      subject: `Civic Complaint - ${complaint.issueType} - ${complaint.complaintId}`,
      text: complaint.aiGeneratedComplaint,
    };

    // 2. Email to Citizen
    const citizenMailOptions = {
      from: 'noreply@civicai.org',
      to: citizenEmail,
      subject: `Complaint ${complaint.complaintId} Submitted Successfully`,
      text: `Your complaint has been forwarded to ${complaint.authorityName}.\n\nReference: ${complaint.referenceNumber}`,
    };

    await Promise.all([
      transporter.sendMail(authorityMailOptions),
      transporter.sendMail(citizenMailOptions),
    ]);

    console.log(`Emails sent successfully for complaint ${complaint.complaintId}`);
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}

module.exports = {
  sendComplaintEmail,
};
