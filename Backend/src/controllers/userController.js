// // 1. User Controller (Backend/src/controllers/userController.js)
// const registerUser = async (req, res) => {
//     try {
//         const { email } = req.body;
        
//         // Check if user exists before trying to create
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ 
//                 success: false,
//                 message: 'User already exists with this email' 
//             });
//         }

//         // If user doesn't exist, proceed with creation
//         const user = await User.create(req.body);
//         res.status(201).json({
//             success: true,
//             user
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// // 2. File Upload Configuration (Backend/src/middleware/fileUpload.js)
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Create uploads directory if it doesn't exist
// const createUploadsDir = () => {
//     const uploadPath = path.join(__dirname, '../../uploads');
//     if (!fs.existsSync(uploadPath)) {
//         fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     return uploadPath;
// };

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         const uploadPath = createUploadsDir();
//         cb(null, uploadPath);
//     },
//     filename: function(req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only .png, .jpg and .jpeg files are allowed!'));
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5MB
//     }
// });

// module.exports = upload;

// // 3. Server Configuration (Backend/src/server.js)
// const express = require('express');
// const path = require('path');
// const app = express();

// // Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Serve static files from uploads directory
// app.use('/uploads', express.static(uploadsDir));

// // 4. Post Controller (Backend/src/controllers/postController.js)
// const createPost = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Please upload an image'
//             });
//         }

//         const post = new Post({
//             title: req.body.title,
//             content: req.body.content,
//             image: `/uploads/${req.file.filename}`,
//             author: req.user._id // Assuming you have authentication middleware
//         });

//         await post.save();
//         res.status(201).json({
//             success: true,
//             post
//         });
//     } catch (error) {
//         // If there's an error, clean up the uploaded file
//         if (req.file) {
//             fs.unlink(req.file.path, (err) => {
//                 if (err) console.error('Error deleting file:', err);
//             });
//         }
        
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
const User = require('../models/User');
const Blog = require('../models/Blog');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Delete all blogs by this user
    await Blog.deleteMany({ author: req.params.id });
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get user blogs
exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add blog to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if blog exists
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    // Check if already in favorites
    if (user.favorites.includes(req.params.blogId)) {
      return res.status(400).json({
        success: false,
        error: 'Blog already in favorites'
      });
    }
    
    user.favorites.push(req.params.blogId);
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Remove blog from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if blog is in favorites
    if (!user.favorites.includes(req.params.blogId)) {
      return res.status(400).json({
        success: false,
        error: 'Blog not in favorites'
      });
    }
    
    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.blogId
    );
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get user favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'favorites',
      populate: [
        { path: 'category', select: 'name' },
        { path: 'author', select: 'name email' }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: user.favorites.length,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};