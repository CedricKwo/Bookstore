const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailStatus: { type: String, default: 'unverified' },
  role: { type: String, default: 'user' },
  accountStatus: { type: String, default: 'active' },
  // Other info...
  firstname: { type: String, required: true},
  middlename: {type: String, required: false},
  lastname: {type: String, required: true},
  birthday: {type: String, required: false},
  phonenumber: {type: String, required: true},
  apartment: {type: Number, required: false},
  streetnumber: {type: Number, required: false},
  streetname: {type: String, required: false},
  postalcode: {type: String, required: false},
  city: {type: String, required: false},
  province: {type: String, required: false},
  country: {type: String, required: false},
  tokenVersion: {type: Number, default: 0},
  verificationCodeTypes: [
    {
      type: {type: String},
      code: String,
      createdAt: Date,
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
