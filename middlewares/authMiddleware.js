const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(400).json({ message: 'Please login first' });
    }
    console.log(token);
    const decodedToken = jwt.verify(token, config.jwtSecret);
    console.log("decodedToken:", decodedToken);

    // Verify the version of token
    const user = await User.findById(decodedToken.userId);
    console.log(user);
    if (!user || decodedToken.tokenVersion !== user.tokenVersion){
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }

    req.userData = { userId: decodedToken.userId, userEmail: user.email, userTokenVersion: user.tokenVersion};
    console.log("userData:", req.userData);
    next();
  } catch (err) {
    res.status(402).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
