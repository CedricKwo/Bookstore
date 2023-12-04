const nodemailer = require('nodemailer');
const config = require('../config')

const transport = nodemailer.createTransport({

    host: config.email.host,
    port: config.email.port, // SMTP port of QQ mailbox
    secure: config.email.ifSSL, // If use SSL encryption
    auth: {
        user: config.email.user, // Sender email
        pass: config.email.authCode, // Auth code of QQ mailbox
    },
});

async function sendVerificationCode(email, verificationCode, codeType) {
    let subject = '';
    let text = '';
  
    switch (codeType) {
      case 'passwordChange':
        subject = 'Verification Code for Changing Password';
        text = `Your verification code for changing password is: ${verificationCode}`;
        break;
      case 'registration':
        subject = 'Verification Code for Registration';
        text = `Your verification code for registration is: ${verificationCode}`;
        break;
        case 'passwordReset':
          subject = 'Verification Code for Password Reset';
          text = `Your verification code for password reset is: ${verificationCode}`;
          break;
      // Other kinds of verification code
      default:
        subject = 'Verification Code';
        text = `Your Verification code is: ${verificationCode}`;
        break;
    }
  
    const mailOptions = {
      from: config.email.user,
      to: email,
      subject,
      text,
    };
  
    try {
      const info = await transport.sendMail(mailOptions);
      console.log('Verification code has been sent: ' + info.response);
    } catch (error) {
      console.error('Fail to send verification code:', error);
      throw new Error('Fail to send verification code');
    }
  }
  
  module.exports = {
    sendVerificationCode,
  };