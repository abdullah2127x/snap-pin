"use server";

import nodemailer from "nodemailer";

// Create transporter with error handling for missing environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationCode = async ({ email, code }) => {
  const emailHtmlContent = `
  <html>
    <head>
      <style>
        body, h1, p {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f7fc;
          color: #333;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        .email-header {
          text-align: center;
          background-color: #2c3e50;
          color: #ffffff;
          padding: 15px;
          border-radius: 8px 8px 0 0;
        }
        .email-header h1 {
          font-size: 24px;
        }
        .email-body {
          padding: 20px;
        }
        .email-body p {
          font-size: 16px;
          line-height: 1.5;
        }
        .verification-code {
          display: inline-block;
          padding: 10px 20px;
          font-size: 20px;
          font-weight: bold;
          background-color: #e8f0ff;
          border-radius: 5px;
          margin: 15px 0;
          color: #2c3e50;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Sign In Verification Code</h1>
        </div>
        <div class="email-body">
          <p>Hi,</p>
          <p>Use the following code to sign in to your account:</p>
          <p class="verification-code">${code}</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      </div>
    </body>
  </html>
`;

  // Check if required environment variables are set
  if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
    console.error("Missing EMAIL or EMAIL_PASSWORD environment variables.");
    return {
      success: false,
      message: "Server configuration error",
      error: true,
    };
  }

  const mailOptions = {
    from: `SnapPin - URL Shortener <${process.env.EMAIL}>`,
    to: email, // User's email passed as an argument
    subject: `Your SnapPin Verification Code`, // Clear subject
    html: emailHtmlContent, // Updated HTML content with verification code
  };

  try {
    // Attempt to send the email
    await transporter.sendMail(mailOptions);
    console.log("the email code is ", code);
    return { success: true, message: "Email sent successfully", error: false };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email", error: true };
  }
};

export { sendVerificationCode };
