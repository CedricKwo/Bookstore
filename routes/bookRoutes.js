const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');

// router.get('/search/:query', authMiddleware, bookController.getBooksFromAPI);
router.get('/search/:query', bookController.getBooksFromAPI);
// 其他书籍路由...

module.exports = router;
