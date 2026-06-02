import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let transporter = null;
if (env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
}

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    logger.warn(`[Email DEV] to=${to}\n${subject}\n${html}`);
    return;
  }
  await transporter.sendMail({ from: env.SMTP_USER, to, subject, html });
};
