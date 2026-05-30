import nodemailer from 'nodemailer';
import { env } from './env.js';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: { user: env.smtp.user, pass: env.smtp.pass },
});

/**
 * Send an email.
 * @param {object} opts - { to, subject, html }
 */
export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"AECCENTRIC EMS" <${env.smtp.user}>`,
    to, subject, html,
  });
};
