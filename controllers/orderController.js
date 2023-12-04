const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
  try {
    const orderInfo = req.body;
    const userId = req.userData.userId;
    
    const orderStatus = await orderService.createOrder(userId, orderInfo)

    let statusCode = 200;
    let message = orderStatus;

    if (orderStatus === 1){
      statusCode = 401;
      message = 'User not found';
    }
    else if (orderStatus === 2 || orderStatus === 3) {
      statusCode = 402;
      message = 'Payment error, please check payment infomation';
    }

    else if (orderStatus === 4) {
      statusCode = 403;
      message = 'Payment unsuccessful, plase go to the order page to complete the payment';
    }

    res.status(statusCode).json({ message });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.queryOrder = async (req, res) => {
  try {
    const userId = req.userData.userId;
    
    const orders = await orderService.queryOrder(userId)

    let statusCode = 200;
    let message = orders;

    if (orders === 1){
      statusCode = 401;
      message = 'User not found';
    }

    res.status(statusCode).json({ message });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
