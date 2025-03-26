"use server";
import nodemailer from "nodemailer";

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_PORT = parseInt(process.env.SMTP_SERVER_PORT || "465", 10);
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: SMTP_SERVER_PORT,
  secure: SMTP_SERVER_PORT === 465,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
}: {
  email: string;
  sendTo?: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: email,
      to: sendTo || SITE_MAIL_RECIEVER,
      subject: subject,
      text: text || "",
      html: html || "",
    });
    return info;
  } catch (error) {
    console.error(
      "Something Went Wrong",
      SMTP_SERVER_USERNAME,
      SMTP_SERVER_PASSWORD,
      error,
    );
  }
}
