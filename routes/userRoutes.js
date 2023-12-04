const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST->Add, GET->Select, PUT->Update, DELETE->Delete
router.post('/register', userController.registerUser);
router.post('/resend-verification-code', userController.sendVerificationCode);
router.put('/verify-verification-code', userController.verifyUserEmail);
router.post('/request-resetting-password', userController.requestResettingPassword);
router.put('/reset-password', userController.resetUserPassword);
router.post('/login', userController.loginUser);
router.get('/get-profile', authMiddleware, userController.getUserProfile);
router.put('/update-profile', authMiddleware, userController.updateUserProfile);
router.post('/request-changing-password', authMiddleware, userController.requestChaningPassword);
router.put('/update-password', authMiddleware, userController.updateUserPassword);
router.put('/logout', authMiddleware, userController.logoutUser);
router.get('/verify-admin', authMiddleware, userController.verifyRole);
router.get('/admin-query-userinfo', authMiddleware, userController.getUserProfileByEmail);
router.put('/admin-update-userinfo', authMiddleware, userController.updateUserProfileByEmail);


module.exports = router;
