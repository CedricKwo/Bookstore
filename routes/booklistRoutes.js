const express = require('express');
const router = express.Router();
const booklistController = require('../controllers/booklistController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create-new-booklist', authMiddleware, booklistController.createNewBooklist);
router.get('/request-add-book-to-booklist', authMiddleware, booklistController.requestAddToBooklist);
router.post('/add-book-to-booklist', authMiddleware, booklistController.addBookToBooklist);
router.put('/remove-book-from-booklist', authMiddleware, booklistController.removeBookFromBooklist);
router.get('/query-booklist-info', authMiddleware, booklistController.queryBooklistInfo);
router.put('/update-booklist-info', authMiddleware, booklistController.updateBooklistInfo);
router.delete('/delete-booklist', authMiddleware, booklistController.deleteBooklist);
router.get('/unauthorized-get-public-booklist', booklistController.getLastestTenPublicBooklist);
router.get('/get-all-public-booklist', authMiddleware, booklistController.getAllPublicBooklist);
router.put('/make-comment-to-booklist', authMiddleware, booklistController.makeCommentToBooklist);
router.put('/admin-maintain-comments', authMiddleware, booklistController.adminMaintainComments);



module.exports = router;