const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
// const path = require('path');
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route to handle form submission
app.post('/submit-application', upload.single('resume'), (req, res) => {
    const { name, mobile, email, qualification, experience, jobrole } = req.body;
    const resume = req.file;

    // Email options
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender address
        to: 'adityarajsingh272003@gmail.com', // Receiver address (e.g., HR email)
        subject: `Job Application from ${name}`,
        html: `
            <h3>New Job Application</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Mobile:</strong> ${mobile}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Qualification:</strong> ${qualification}</p>
            <p><strong>Experience:</strong> ${experience} years</p>
            <p><strong>Job Role:</strong> ${jobrole}</p>
        `,
        attachments: [
            {
                filename: resume.originalname,
                content: resume.buffer
            }
        ]
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send application' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Application submitted successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});