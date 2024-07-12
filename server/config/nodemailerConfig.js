import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_HOST,
  secure: true,
  port: process.env.EMAIL_PORT,
  tls: {
    rejectUnauthorized: true,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
