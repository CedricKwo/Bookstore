const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const { sendVerificationCode } = require('../utils/nodemailer');


// User register
async function registerUser(userInfo) {
    const email = userInfo.email;
    const user = await User.findOne({ email });
    // Email has been registered
    if (user) {
        return 1;
    }
    const username = userInfo.username;
    const password = userInfo.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const firstname = userInfo.firstname;
    const middlename = userInfo.middlename;
    const lastname = userInfo.lastname;
    const birthday = userInfo.birthday;
    const phonenumber = userInfo.phonenumber;
    const apartment = userInfo.apartment;
    const streetnumber = userInfo.streetnumber;
    const streetname = userInfo.streetname;
    const postalcode = userInfo.postalcode;
    const city = userInfo.city;
    const province = userInfo.province;
    const country = userInfo.country;
    const newUser = new User({ username, 
                               email, 
                              password: hashedPassword,
                              firstname,
                              middlename,
                              lastname,
                              birthday,
                              phonenumber,
                              apartment,
                              streetnumber,
                              streetname,
                              postalcode,
                              city,
                              province,
                              country });
    await newUser.save();

  // Send verification email
  await sendVerificationCodeToEmail(email, 'registration');

  return newUser;
}

// Save the verification code to DB & send verification code to email to verify the user identity
async function sendVerificationCodeToEmail(email, codeType){
    const user = await User.findOne({ email });
    // User not found
    if(!user) {
        return null;
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

    await sendVerificationCode(email, verificationCode, codeType);
    return await user.save();
}

// Verify the verification code
async function verifyCode(email, codeType, verificationCode) {
    const user = await User.findOne({ email });
    const codeDetails = user.verificationCodeTypes.find((type) => type.type === codeType);
  
    console.log(user);
    console.log(codeDetails);
    if (!codeDetails || codeDetails.code !== verificationCode) {
        
        return 1;
    }
  
    const expirationTime = 10 * 60 * 1000; // 10min expiry time
    const currentTime = new Date();
    const codeCreationTime = new Date(codeDetails.createdAt);
  
    if (currentTime - codeCreationTime > expirationTime) {

        return 2;
    }
  
    if (codeType === 'registration'){

        user.emailStatus = 'verified';
        return await user.save();
    }

    return 0;

}

// Request for password reset
async function requestResettingPassword(email){
  const user = await User.findOne({email: email});
  if (!user) {
    return 1;
  }
  return await sendVerificationCodeToEmail(email, 'passwordReset');
}

// Reset password
async function resetUserPassword(email, verificationCode, newPassword) {

  const user = await User.findOne({email: email});
  if (!user) {
    return 1;
  }

  const verifiedCode = await verifyCode(user.email, 'passwordReset', verificationCode);
  // Verification code was incorrect
  if (verifiedCode === 1) {
    return 2;
  }

  // Verification code was expiried
  else if (verifiedCode === 2) {
    return 3;
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;

  return await user.save();
}


// User login
async function loginUser(email, password) {
  const user = await User.findOne({ email });
  // User does not exist
  if (!user) {
    return 1;
  }
  else if (user && user.emailStatus === 'unverified') {
    return 2;
  }
  else if (user && user.accountStatus === 'deactivated') {
    return 3;
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  // Wrong password
  if (!passwordMatch) {
    return 5;
  }
  const token = jwt.sign({ userId: user._id, tokenVersion: user.tokenVersion}, config.jwtSecret, { expiresIn: '720h' });
  return token;
}

// Get the user info
async function getUserProfile(userId) {
  return await User.findById(userId).select('-password');
}

// Update user info
async function updateUserProfile(userId, userInfo) {
  const user = await User.findById(userId);
  // User not found
  if (!user) {
    return null;
  }
  // Update user info, only update the attribute userInfo contains
  Object.keys(userInfo).forEach((key) => {
    if (key in user) {
        user[key] = userInfo[key];
    }
  });
  return await user.save();
}

// Request for changing password
async function requestChangingPassword(email){
    return await sendVerificationCodeToEmail(email, 'passwordChange');
}


// Update user password, need to provide current password
async function updateUserPassword(userId, verificationCode, currentPassword, newPassword) {
  const user = await User.findById(userId);
  // User does not exist
  if (!user) {
    return 1;
  }
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  // Current password does not match
  if (!passwordMatch) {
    return 2;
  }
  const verifiedCode = await verifyCode(user.email, 'passwordChange', verificationCode);
  // Verification code was incorrect
  if (verifiedCode === 1) {
    return 3;
  }

  // Verification code was expiried
  else if (verifiedCode === 2) {
    return 4;
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedNewPassword;
  // Update token version to make current token invalid
  user.tokenVersion = user.tokenVersion ? user.tokenVersion + 1 : 1;

  return await user.save();
}

// User logout
async function logoutUser(userId){
  const user = await User.findById(userId);
  // User not found
  if (!user) {
    return 1;
  }

  // Use token version to make current token expired in Server
  user.tokenVersion = user.tokenVersion ? user.tokenVersion + 1 : 1;
  return await user.save();

}

/****  Admin function ***/
// Verify if the user is admin
async function verifyRole (userId){
  const user = await User.findById(userId);

  // User not found
  if (!user) {
    return 1;
  }

  // User is not admin or manager or manager
  else if (user.role !== 'admin' && user.role !== 'manager'){
    return 2;
  }

  return 0;

}

// Query user info by email
async function getUserProfileByEmail (userId, emailInput){
  const user = await verifyRole(userId);

  // User not found or not admin
  if (user === 1){
    return 1;
  }
  else if (user === 2) {
    return 2;
  }

  console.log("emailInput:", emailInput);
  const requestedUser = await User.findOne({ email: emailInput });
  console.log("requestedUser:", requestedUser);

  return requestedUser;

}

// Update user info by email
async function updateUserProfileByEmail (userId, emailInput, updatedUserInfo){
  const user = await verifyRole(userId);

  // User not found or not admin
  if (user === 1){
    return 1;
  }
  else if (user === 2) {
    return 2;
  }

  const requestedUser = await User.findOne({ email: emailInput });

  // Update user info, only update the attribute updatedUserInfo contains
  Object.keys(updatedUserInfo).forEach((key) => {
    if (key in requestedUser) {
      requestedUser[key] = updatedUserInfo[key];
    }
  });
  await requestedUser.save();

  return requestedUser;

}

module.exports = {
  registerUser,
  sendVerificationCodeToEmail,
  verifyCode,
  requestResettingPassword,
  resetUserPassword,
  loginUser,
  getUserProfile,
  updateUserProfile,
  requestChangingPassword,
  updateUserPassword,
  logoutUser,
  verifyRole,
  getUserProfileByEmail,
  updateUserProfileByEmail,

};
