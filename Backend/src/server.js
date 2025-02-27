// // // const express = require('express');
// // // const cors = require('cors');
// // // const dotenv = require('dotenv');
// // // const connectDB = require('./config/db');
// // // const authRoutes = require('./routes/authRoutes');

// // // dotenv.config(); // Load environment variables

// // // const app = express();
// // // const PORT = process.env.PORT || 5000;

// // // // Middleware
// // // app.use(cors());
// // // app.use(express.json());

// // // // Database Connection
// // // connectDB();

// // // // Routes
// // // app.use('/api/auth', authRoutes);

// // // // Start Server
// // // app.listen(PORT, () => {
// // //   console.log(`Server running on port ${PORT}`);
// // // });
// // const express = require('express');
// // const cors = require('cors');
// // const dotenv = require('dotenv');
// // const connectDB = require('./config/db');
// // const authRoutes = require('./routes/authRoutes');
// // const User = require('./models/User'); // Import User model
// // const bcrypt = require('bcryptjs'); // For password hashing
// // const jwt = require('jsonwebtoken'); // For generating tokens
// // const nodemailer = require('nodemailer'); // For sending emails

// // dotenv.config(); // Load environment variables

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // // Database Connection
// // connectDB();

// // // Routes
// // app.use('/api/auth', authRoutes);

// // // Login API
// // app.post('/api/auth/login', async (req, res) => {
// //   const { email, password, userType } = req.body;

// //   try {
// //     // Find user by email and userType
// //     const user = await User.findOne({ email, userType });

// //     if (!user) {
// //       return res.status(400).json({ error: 'User not found' });
// //     }

// //     // Compare passwords
// //     const isMatch = await bcrypt.compare(password, user.password);

// //     if (!isMatch) {
// //       return res.status(400).json({ error: 'Invalid credentials' });
// //     }

// //     // Generate JWT token
// //     const token = jwt.sign({ id: user._id, userType }, process.env.JWT_SECRET, {
// //       expiresIn: '1h', // Token expires in 1 hour
// //     });

// //     res.json({ token });
// //   } catch (error) {
// //     console.error('Login error:', error);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });

// // // Forgot Password API
// // app.post('/api/auth/forgot-password', async (req, res) => {
// //   const { email } = req.body;

// //   try {
// //     // Find user by email
// //     const user = await User.findOne({ email });

// //     if (!user) {
// //       return res.status(400).json({ error: 'User not found' });
// //     }

// //     // Generate a reset token
// //     const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
// //       expiresIn: '10m', // Token expires in 10 minutes
// //     });

// //     // Create reset link
// //     const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

// //     // Send email with reset link
// //     const transporter = nodemailer.createTransport({
// //       service: 'gmail',
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //       },
// //     });

// //     const mailOptions = {
// //       from: process.env.EMAIL_USER,
// //       to: email,
// //       subject: 'Password Reset',
// //       text: `Click here to reset your password: ${resetLink}`,
// //     };

// //     await transporter.sendMail(mailOptions);

// //     res.json({ message: 'Reset link sent to your email' });
// //   } catch (error) {
// //     console.error('Forgot password error:', error);
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });
// // // Start Server
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const blogRoutes = require('./routes/blogRoutes'); // Updated path
// const User = require('./models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const path = require('path');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Serve static files from public directory
// app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// // Database Connection
// connectDB();

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/blogs', blogRoutes);

// // Rest of your existing server.js code...

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');

// Import models
const User = require('./models/User');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

// Authentication API endpoints

// Login API
app.post('/api/auth/login', async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    // Find user by email and userType
    const user = await User.findOne({ email, userType });

    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, userType }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Register API
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role, userType } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'user',
      userType
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, userType }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Forgot Password API
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found' });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '10m', // Token expires in 10 minutes
    });

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click here to reset your password: ${resetLink}`,
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your BlogApp account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetLink}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Reset Password API
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id from token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Save user with new password
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ success: false, error: 'Token expired' });
    }
    
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));