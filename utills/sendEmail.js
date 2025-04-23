const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetCode = async (to, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${code}`,
    html: `<h2>Your password reset code:</h2><p style="font-size: 24px;"><strong>${code}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetCode;
