const { promisify } = require("util");
const nodeMailer = require("nodemailer");
const sendEmail = async (options) => {
  const transport = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 25,
    secure: false,
    auth: {
      user: "7554c24d53c786",
      pass: "ace7b536ed2439",
    },
  });
  const mailOptions = {
    from: "oyetunjiibukunoluwa@gmail.com",
    to: options.email,
    subject: options.subject,
    message: options.message,
  };
  await transport.sendMail(mailOptions);
};
module.exports = sendEmail;
