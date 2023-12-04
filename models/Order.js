const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  bookName: { type: String },
  bookPrice: { type: Number, required: true },
  bookCount: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderId: {type: String, unique: true, required: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createTime: {type: Date, required: true},
  // order status
  status: { type: String, default: 'unpaid' },
  // products info
  products: [productSchema],
  subtotal: { type: Number, required: true},
  tax: { type: Number, required: true },
  shipping: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  // payment info
  actualPayment: { type: Number, required: true },
  paymentCard: { type: String, required: true },
  // shipping info
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  unit: { type: String },
  streetNumber: { type: String, required: true },
  streetName: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  country: { type: String, required: true },
  
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
