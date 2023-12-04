
const cartService = require('../services/cartService');

exports.addToCart = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.userData.userId;
    const cart = await cartService.addToCart(userId, bookId);

    let statusCode = 200;
    let message = "Add to cart successful";

    res.status(statusCode).json({message});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reduceCartItem = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.userData.userId;
    console.log("userData:", req.userData); 

    const cart = await cartService.reduceCartItem(userId, bookId);

    let statusCode = 200;
    let message = cart;

    if (cart === 1) {
      statusCode = 401;
      message = 'Cart not found';
      
    }
    else if (cart === 2) {
      statusCode = 402;
      message = 'Book not found in cart';
  
    }
    else if (cart === 3) {
      statusCode = 403;
      message = 'Book count cannot be less than 1';

    }
    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.increaseCartItem = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.userData.userId;
    const cart = await cartService.increaseCartItem(userId, bookId);

    let statusCode = 200;
    let message = cart;

    if (cart === 1) {
      statusCode = 401;
      message = 'Cart not found';

    }
    else if (cart === 2) {
      statusCode = 402;
      message = 'Book not found in cart';

    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setCartItemCount = async (req, res) => {
  try {
    const { bookId, bookCount } = req.body;
    const userId = req.userData.userId;
    const cart = await cartService.setCartItemCount(userId, bookId, bookCount);

    let statusCode = 200;
    let message = cart;

    if (cart === 1) {
      statusCode = 401;
      message = 'Cart not found';
    }
    else if (cart === 2) {
      statusCode = 402;
      message = 'Book not found in cart';

    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.removeItemFromCart = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.userData.userId;
    const cart = await cartService.removeItemFromCart(userId, bookId);

    let statusCode = 200;
    let message = cart;

    if (cart === 1) {
      statusCode = 401;
      message = 'Cart not found';
    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.displayCart = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const cart = await cartService.displayCart(userId);

    let statusCode = 200;
    let message = cart;

    if (cart === 1) {
      statusCode = 401;
      message = 'Cart not found';
    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkoutCart = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const items = req.body;
    const cart = await cartService.checkoutCart(userId, items);

    let statusCode = 200;
    let message = cart;

    if (cart === 1) {
      statusCode = 401;
      message = 'Cart not found';
    }

    else if (cart === 2 || cart === 3) {
      statusCode = 402;
      message = 'Cart items do not match';
    }

    res.status(statusCode).json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


