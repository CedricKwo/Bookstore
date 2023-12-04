const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 发送修改密码验证码至邮箱
router.post('/request-password-change-code', (req, res) => authController.sendVerificationCodeToEmail(req, res, 'passwordChange'));

// 发送用户注册验证码至邮箱
router.post('/request-registration-code', (req, res) => authController.sendVerificationCodeToEmail(req, res, 'registration'));

// 验证用户输入的验证码，并允许用户设置新密码
router.post('/verify-and-reset-password', authController.verifyAndResetPassword);

// 用户注册并验证验证码
router.post('/register-user', authController.registerUser);

//Test sending email
router.post('/test-sending-email', authController.registerUser);

module.exports = router;
