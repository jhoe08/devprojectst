require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
//   host: 'localhost', // Change this if you're using a specific SMTP server
//   port: 1025, // Common default SMTP port for local testing (MailHog)
//   secure: false, // Set to true for SSL/TLS (if using port 465)
//   tls: {
//     rejectUnauthorized: false // Disable security for local testing
//   }
service: 'gmail',  // Gmail service
  auth: {
    user: 'red.mrjhon8@gmail.com',  // Your Gmail address
    pass: process.env.APP_PASS      // Your App Password (not your main Gmail password)
  }
});

// Set up email data
let mailOptions = {
  from: '"Sender Name" <sender@example.com>', // Sender address
  to: 'red.mrjhon8@gmail.com', // List of recipients
  subject: 'Test Email from Node.js', // Subject line
  text: 'Hello, this is a test email sent from Node.js!', // Plain text body
  html: '<b>Hello, this is a test email sent from Node.js!</b>' // HTML body
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error sending email:', error);
  }
  console.log('Email sent:', info.response);
});