const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  bookPrice: {type: Number, default: 0},
  bookCount: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  items: [cartItemSchema],
  // Other information
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

