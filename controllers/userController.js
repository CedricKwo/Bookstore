const userService = require('../services/userService');
const updateTokenMiddleware = require('../middlewares/updateTokenMiddleware')


// User register
exports.registerUser = async (req, res) => {
  try {
    const userInfo = req.body;
    const registerStatus = await userService.registerUser(userInfo);

    let statusCode = 200;
    let message = 'Verify the email to activate your account';

    if (registerStatus === 1) {
      statusCode = 401;
      message = 'Email has been registered, please try to use another email or reset your password';
      
    }

    res.status(statusCode).json({ message });

    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};

// Send verification code
exports.sendVerificationCode = async (req, res) => {
  try {
    const { email, codeType } = req.body;
    await userService.sendVerificationCodeToEmail(email, codeType);
    
    res.status(200).json({ message: 'Verification code has been resent successful' });
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};


// User email verification
exports.verifyUserEmail = async (req, res) => {
  try {
    const {email, verificationType, verificationCode} = req.body;
    const validCode = await userService.verifyCode(email, verificationType, verificationCode);

    let statusCode = 200;
    let message = 'Email verified successful';

    if (validCode === 1) {
      statusCode = 401;
      message = 'Incorrect verification code';

    }
    else if (validCode === 2) {
      statusCode = 402;
      message = 'Verification code has expired';

    }

    res.status(statusCode).json({ message });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// User request for password reset
exports.requestResettingPassword = async (req, res) => {
  try {
    const {userEmail} = req.body;
    const info = await userService.requestResettingPassword(userEmail);

    let statusCode = 200;
    let message = "Verification code has been sent";

    if (info === 1) {
      statusCode = 401;
      message = "User not found";
    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset the password
exports.resetUserPassword = async (req, res) => {
  try {
    const {email, verificationCode, newPassword} = req.body;
    const info = await userService.resetUserPassword(email, verificationCode, newPassword);

    let statusCode = 200;
    let message = "Password has been reset successful";

    if (info === 1) {
      statusCode = 401;
      message = "User not found";
    }

    else if (info === 2) {
      statusCode = 402;
      message = "Verification code incorrect";
    }

    else if (info === 3) {
      statusCode = 403;
      message = "Verification code expiried";
    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);

    let statusCode = 200;
    let message = {token};

    if (token === 1) {
      statusCode = 401;
      message = 'User not found';

    }
    // User cannot login before the email is verified
    else if (token === 2) {
      statusCode = 402;
      message = 'Email unverified, please verify your email first';
      
    }

    else if (token === 3) {
      statusCode = 403;
      message = 'Account deactivated, please contact the administrator';

    }

    else if (token === 5) {
      statusCode = 405;
      message = 'Wrong password';

    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const user = await userService.getUserProfile(userId);

    let statusCode = 200;
    let message = user;

    if (!user) {
      statusCode = 401;
      message = 'User not found';

    }
    console.log("What is going on?");

    // Update user token
    // const newToken = await updateTokenMiddleware(userId);
    // console.log("---newToken---:", newToken);
    // res.setHeader('Authorization', `Bearer ${newToken}`);

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user basic info
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const userInfo = req.body;
    const updatedUser = await userService.updateUserProfile(userId, userInfo);

    let statusCode = 200;
    let message = updatedUser;

    if (!updatedUser) {
      statusCode = 401;
      message = 'User not found';

    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Request for changing password, send verification code first
exports.requestChaningPassword = async (req, res) => {
  try {
    const userEmail = req.userData.userEmail;
    await userService.requestChangingPassword(userEmail);

    res.status(200).json({ message: 'Verification code has been sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user password
exports.updateUserPassword = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { verificationCode, currentPassword, newPassword } = req.body;
    const passwordUpdated = await userService.updateUserPassword(userId, verificationCode, currentPassword, newPassword);

    let statusCode = 200;
    let message = 'Password updated. Please login again.';

    if (passwordUpdated === 1) {
      statusCode = 401;
      message = 'User not found';
      
    }
    else if (passwordUpdated === 2) {
      statusCode = 402;
      message = 'Current password is incorrect';
      
    }
    else if (passwordUpdated === 3) {
      statusCode = 403;
      message = 'Verification code is incorrect';
      
    }
    else if (passwordUpdated === 4) {
      statusCode = 405;
      message = 'Verification code has been expired';
      
    }


    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User logout
exports.logoutUser = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const logoutCode = await userService.logoutUser(userId);

    let statusCode = 200;
    let message = 'Logout successful.';

    if (logoutCode === 1) {
      statusCode = 401;
      message = 'User not found';
    }
    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin verify
exports.verifyRole = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const user = await userService.verifyRole(userId);

    let statusCode = 200;
    let message = user;

    if (user === 1) {
      statusCode = 401;
      message = 'User not found';
    }

    else if (user === 2) {
      statusCode = 402;
      message = 'User is not admin, no access to this content';
    }


    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin query user info
exports.getUserProfileByEmail = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const emailInput = req.body;
    const requestedUser = await userService.getUserProfileByEmail(userId, emailInput.email);

    let statusCode = 200;
    let message = requestedUser;

    if (requestedUser === 1) {
      statusCode = 401;
      message = 'User not found';
    }

    else if (requestedUser === 2) {
      statusCode = 402;
      message = 'User is not admin, no access to this content';
    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin update user info
exports.updateUserProfileByEmail = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const updatedUserInfo = req.body;
    const requestedUser = await userService.updateUserProfileByEmail(userId, updatedUserInfo.email, updatedUserInfo);

    let statusCode = 200;
    let message = requestedUser;

    if (requestedUser === 1) {
      statusCode = 401;
      message = 'User not found';
    }

    else if (requestedUser === 2) {
      statusCode = 402;
      message = 'User is not admin, no access to this content';
    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};