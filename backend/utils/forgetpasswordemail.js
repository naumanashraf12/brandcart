const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  console.log(process.env.SMPT_FROM_NAME);
  const transportor = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    auth: {
      user: process.env.SMPT_EMAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });
  const message = {
    from: `${process.env.SMPT_FROM_NAME} <${process.env.SMPT_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transportor.sendMail(message);
};
module.exports = sendEmail;
