const multer = require("multer");
const ImageKit = require("imagekit");

const storage = multer.memoryStorage();

const nodemailer = require("nodemailer");

module.exports = class Utils {
  static imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
  static upload = multer({ storage });

  static sendMail() {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });

    const mailOptions = {
      from: "ccliffordwilliam@gmail.com",
      to: "ccliffordwilliam@gmail.com",
      subject: "Nodemailer Project",
      text: "Hi from your nodemailer project",
    };

    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });
  }
};
