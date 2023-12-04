import nodemailer from "nodemailer";

const { API_URL, UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (email, code) => {
  const letter = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${API_URL}/auth/verify/${code}">Click to verify email.</a>`,
    from: UKR_NET_EMAIL,
  };

  return transport.sendMail(letter);
};

export default sendEmail;
