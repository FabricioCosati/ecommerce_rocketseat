const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "021ecf3d1c35ab",
      pass: "26ab76b48df2e4"
    }
  });
