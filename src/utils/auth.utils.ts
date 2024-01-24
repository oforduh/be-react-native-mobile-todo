import sgMail from "@sendgrid/mail";

import { User } from "../models/user.model";

import _2faMail from "../mails/2faMail";
import welcomeMail from "../mails/welcomeMail";
import verifyAccountMail from "../mails/verificationMail";
import resetPasswordMail from "../mails/resetPassword";

import { BadRequestError } from "../errors/bad-request-error";
import dayjs from "dayjs";
import nodemailer from "nodemailer";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const GMAIL = "recurrentng@gmail.com";

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL,
    pass: "eawepuxqjapchnar",
  },
});

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const html = welcomeMail(name);
    const mail = {
      to: email,
      from: GMAIL,
      subject: "Welcome to re:current",
      text: "We're glad you're here",
      html,
    };
    await mailTransporter.sendMail(mail);
    // await sgMail.send(mail);
  } catch (error) {
    throw error;
  }
};
export const sendResetPasswordMail = async (
  email: string,
  name: string,
  token: string
) => {
  try {
    const html = resetPasswordMail(token, name);
    let mail = {
      to: email,
      from: GMAIL,
      subject: "Password Reset Request",
      text: "We've received a request to reset your account password",
      html,
    };
    await mailTransporter.sendMail(mail);
    // await sgMail.send(mail);
  } catch (error) {
    throw error;
  }
};
