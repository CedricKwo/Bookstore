const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add-to-cart', authMiddleware, cartController.addToCart);
router.put('/reduce-book', authMiddleware, cartController.reduceCartItem);
router.put('/increase-book', authMiddleware, cartController.increaseCartItem);
router.put('/set-book-count', authMiddleware, cartController.setCartItemCount);
router.delete('/remove-book', authMiddleware, cartController.removeItemFromCart);
router.get('/display-cart', authMiddleware, cartController.displayCart);
router.post('/checkout-cart', authMiddleware, cartController.checkoutCart);

module.exports = router;
