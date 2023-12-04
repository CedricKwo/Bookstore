const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create-order', authMiddleware, orderController.createOrder);
router.get('/query-order', authMiddleware, orderController.queryOrder);

module.exports = router;
