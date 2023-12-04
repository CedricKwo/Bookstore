const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendVerificationCode } = require('../utils/nodemailer');

async function sendVerificationCodeToEmail(req, res, codeType) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if(!user) {
      throw new Error('User does not exsit');
    }
    let verificationCodeType = user ? user.verificationCodeTypes.find((type) => type.type === codeType) : null;

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const currentTime = new Date();

    if (!verificationCodeType) {
      verificationCodeType = {
        type: codeType,
        code: verificationCode,
        createdAt: currentTime,
      };

      user.verificationCodeTypes.push(verificationCodeType);
    } else{
      verificationCodeType.code = verificationCode;
      verificationCodeType.createdAt = currentTime;
    }

    console.log(user);

    await user.save();

    await sendVerificationCode(email, verificationCode, codeType);

    return res.status(200).send('Verification code has been sent');
  } catch (err) {
    console.error(err);
    if (err.message === 'User does not exsit') {
      return res.status(404).send('User does not exsit');
    }
    return res.status(500).send('Server Error');
  }
}

// verifyCode
async function verifyCode(user, codeType, verificationCode) {
    const codeDetails = user.verificationCodeTypes.find((type) => type.type === codeType);
  
    if (!codeDetails || codeDetails.code !== verificationCode) {
      return 1;
    }
  
    const expirationTime = 10 * 60 * 1000; // 10min expiry time
    const currentTime = new Date();
    const codeCreationTime = new Date(codeDetails.createdAt);
  
    if (currentTime - codeCreationTime > expirationTime) {
      return 2;
    }
  
    codeDetails.code = null;
    await user.save();
  
    return 0;
}

async function verifyAndResetPassword(req, res) {
    const { email, verificationCode, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).send('User does not exist');
      }
  
      const validCode = await verifyCode(user, 'passwordChange', verificationCode);
  
      if (validCode == 1) {
        return res.status(401).send('Incorrect verification code');
      }
      else if (validCode == 2) {
        return res.status(402).send('Verification code has expired');
      }
  
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
  
      return res.status(200).send('Password has been updated');
    } catch (err) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
}

async function registerUser(req, res) {
    const { email, verificationCode, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (user) {
        return res.status(400).send('邮箱已被注册');
      }
  
      const isValidCode = await verifyCode(user, 'registration', verificationCode);
  
      if (!isValidCode) {
        return res.status(401).send('验证码不匹配或已过期');
      }
  
      const newUser = new User({ email, password });
      newUser.verificationCodeTypes.push({ type: 'registration', code: null, createdAt: null });
      await newUser.save();
  
      return res.status(200).send('用户注册成功');
    } catch (err) {
      console.error(err);
      return res.status(500).send('出现错误');
    }
}



module.exports = {
  sendVerificationCodeToEmail,
  verifyAndResetPassword,
  registerUser,
};
