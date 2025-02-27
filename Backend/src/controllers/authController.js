const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const { generateOTP } = require('../utils/helpers');

// Register User
const registerUser = async (req, res) => {
  const { userType, secretKey, username, email, mobileNo, password } = req.body;

  try {
    console.log('Registering user:', { userType, username, email }); // Debug log

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email); // Debug log
      return res.status(400).json({ error: 'User already exists' });
    }

    // Validate admin secret key
    if (userType === 'admin' && secretKey !== process.env.ADMIN_SECRET_KEY) {
      console.log('Invalid admin secret key'); // Debug log
      return res.status(400).json({ error: 'Invalid admin secret key' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const user = new User({
      userType,
      secretKey,
      username,
      email,
      mobileNo,
      password,
      otp,
      otpExpires,
    });

    await user.save();
    console.log('User saved:', user); // Debug log

    // Send OTP via email
    await sendEmail(email, 'Email Verification', `Your OTP is: ${otp}`);
    console.log('OTP sent to:', email); // Debug log

    res.status(201).json({ message: 'OTP sent to your email', email });
  } catch (error) {
    console.error('Registration error:', error); // Debug log
    res.status(500).json({ error: 'Server error' });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    console.log('Verifying email:', email); // Debug log

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email); // Debug log
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      console.log('Invalid or expired OTP'); // Debug log
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    console.log('Email verified:', email); // Debug log
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error); // Debug log
    res.status(500).json({ error: 'Server error' });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    console.log('Resending OTP to:', email); // Debug log

    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email); // Debug log
      return res.status(400).json({ error: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendEmail(email, 'Email Verification', `Your OTP is: ${otp}`);
    console.log('OTP resent to:', email); // Debug log

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error); // Debug log
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerUser, verifyEmail, resendOTP };