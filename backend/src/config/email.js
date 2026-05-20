import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

/**
 * Send an email.
 * @param {object} opts - { to, subject, html }
 */
export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"AECCENTRIC EMS" <${process.env.SMTP_USER}>`,
    to, subject, html,
  });
};
