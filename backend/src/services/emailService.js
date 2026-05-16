import nodemailer from 'nodemailer';
import { logActivity } from '../config/logger.js';

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Use configured SMTP
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback: Create a test account on ethereal.email if no SMTP config is found
      // This is free and great for testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      console.warn("Using Ethereal Email for testing. Check logs for the URL to preview the email.");
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"WinSpot" <noreply@winspot.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logActivity('info', { action: 'email.send', status: 'success', message: `Email sent to ${to}: ${info.messageId}` });

    if (!process.env.SMTP_HOST) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      logActivity('info', { action: 'email.preview', status: 'success', message: `Preview URL: ${nodemailer.getTestMessageUrl(info)}` });
    }

    return { success: true, info };
  } catch (error) {
    logActivity('error', { action: 'email.send', status: 'failed', message: `Error sending email to ${to}: ${error.message}` });
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
