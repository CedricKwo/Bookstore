const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const config = require('../config');
const stripe = require('stripe')(config.stripeTestKey)

// Generate unique order id
async function generateOrderId () {

    // Generate random number
    const random = Math.floor(Math.random() * 10000);

    // Get current time
    const date = new Date();

    // Get year
    const year = date.getFullYear();
    // Get month
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // Get day
    const day = date.getDate().toString().padStart(2, '0');
    // Get hour
    const hours = date.getHours().toString().padStart(2, '0');
    // Get minute
    const minutes = date.getMinutes().toString().padStart(2, '0');
    // Get second
    const seconds = date.getSeconds().toString().padStart(2, '0');
    // Get millisecond
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    const orderId = 'CA' + `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}${random}`;

    return orderId;
}

// Generate payment method
async function generatePaymentMethod (cardNumber, expiryDate, cvv) {

    try {
        // User stripe to create payment method
        const paymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: {
            number: cardNumber,
            exp_month: expiryDate.split('/')[0],
            exp_year: expiryDate.split('/')[1],
            cvc: cvv,
          },
        });
    
        return paymentMethod.id;
      } catch (err) {
        throw new Error(err.message);
      } 
}

// Create an order
exports.createOrder = async (userId, orderInfo) => {
    try{
        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        const orderId = await generateOrderId();
        const createTime = new Date();
        const products = orderInfo.products;
        const subtotal = orderInfo.subtotal;
        const tax = orderInfo.tax;
        const shipping = orderInfo.shipping;
        const grandTotal = orderInfo.grandTotal;
        const discount = orderInfo.discount;
        const actualPayment = orderInfo.actualPayment;
        const firstName = orderInfo.firstName;
        const lastName = orderInfo.lastName;
        const phoneNumber = orderInfo.phoneNumber;
        const paymentCard = orderInfo.paymentCard;
        const unit = orderInfo.unit;
        const streetNumber = orderInfo.streetNumber;
        const streetName = orderInfo.streetName;
        const postalCode = orderInfo.postalCode;
        const city = orderInfo.city;
        const province = orderInfo.province;
        const country = orderInfo.country;

        const newOrder = new Order({orderId, 
                                    user: userId, 
                                    createTime,
                                    products,
                                    subtotal,
                                    tax,
                                    shipping,
                                    grandTotal,
                                    discount,
                                    actualPayment,
                                    paymentCard,
                                    firstName,
                                    lastName,
                                    phoneNumber,
                                    unit,
                                    streetNumber,
                                    streetName,
                                    postalCode,
                                    city,
                                    province,
                                    country});

        //const paymentMethodId = await generatePaymentMethod(orderInfo.cardNumber, orderInfo.ExpiryDate, orderInfo.CVC)

        const paymentMethodId = 'pm_card_visa';
        // Payment create error
        if (!paymentMethodId) {
            return 2;
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(actualPayment * 100),
            currency: 'CAD', // currency
            payment_method: paymentMethodId, // payment method
            confirm: true, // confirm payment
            return_url: 'https://stripe.com/docs/testing?testing-method=payment-methods', // Redirect page no matter succeed or fail
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
              },
            });
        // Payment error
        if (!paymentIntent) {
            return 3;
        }
        // Payment unsuccessful
        else if (paymentIntent.status !== 'succeeded') {
            return 4;
        }
        // payment successful
        else{
            newOrder.status = 'paid';
        }

        await newOrder.save();

        return paymentIntent;
    } catch (err) {
        throw new Error(err.message);
    }
};

// Query order
exports.queryOrder = async (userId) => {
    try{
        const user = await User.findById(userId);

        // User not found
        if (!user) {
            return 1;
        }

        // Query all the orders of the user, order by createTime desc
        const orders = await Order.find({user: userId}).sort({createTime: -1});

        return orders;

    } catch (err) {
        throw new Error(err.message);
    }
};