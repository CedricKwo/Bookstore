const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const updateTokenMiddleware =  async (userId) => {
  try{
    const shouldUpdateToken = 1;

    if (shouldUpdateToken) {
      const user = await User.findById(userId);

      user.tokenVersion = user.tokenVersion ? user.tokenVersion + 1 : 1;
      await user.save();
      const newToken = jwt.sign({ userId: userId, tokenVersion: user.tokenVersion }, config.jwtSecret, { expiresIn: '10min' });
      console.log("new token:", newToken);
      return newToken;
      //res.setHeader('Authorization', `Bearer ${newToken}`);
    }

  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = updateTokenMiddleware;