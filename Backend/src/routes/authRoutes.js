const express = require('express');
const { registerUser, verifyEmail, resendOTP } = require('../controllers/authController');

const router = express.Router();

// Register User
router.post('/register', registerUser);

// Verify Email
router.post('/verify-email', verifyEmail);

// Resend OTP
router.post('/resend-otp', resendOTP);

module.exports = router;