// // const Blog = require('../models/Blog');
// // const multer = require('multer');
// // const path = require('path');
// // const fs = require('fs');

// // // Configure multer for file uploads
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     const uploadDir = path.join(__dirname, '../../public/uploads');
// //     if (!fs.existsSync(uploadDir)) {
// //       fs.mkdirSync(uploadDir, { recursive: true });
// //     }
// //     cb(null, uploadDir);
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //     cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
// //   }
// // });

// // const upload = multer({ storage: storage });

// // const blogController = {
// //   getUserBlogs: async (req, res) => {
// //     try {
// //       const userId = req.params.userId;
// //       const blogs = await Blog.find({ userId }).sort({ createdAt: -1 });
// //       res.json(blogs);
// //     } catch (error) {
// //       console.error('Error in getUserBlogs:', error);
// //       res.status(500).json({ message: 'Error fetching blogs' });
// //     }
// //   },

// //   getBlog: async (req, res) => {
// //     try {
// //       const { userId, blogId } = req.params;
// //       const blog = await Blog.findOne({ _id: blogId, userId });
// //       if (!blog) {
// //         return res.status(404).json({ message: 'Blog not found' });
// //       }
// //       res.json(blog);
// //     } catch (error) {
// //       console.error('Error in getBlog:', error);
// //       res.status(500).json({ message: 'Error fetching blog' });
// //     }
// //   },

// //   createBlog: async (req, res) => {
// //     try {
// //       const { userId, title, content, place, date } = req.body;
// //       const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

// //       const newBlog = new Blog({
// //         userId,
// //         title,
// //         content,
// //         place,
// //         date: new Date(date),
// //         mediaUrl
// //       });

// //       const savedBlog = await newBlog.save();
// //       res.status(201).json({
// //         message: 'Blog created successfully',
// //         blogId: savedBlog._id
// //       });
// //     } catch (error) {
// //       console.error('Error in createBlog:', error);
// //       res.status(500).json({ message: 'Error creating blog' });
// //     }
// //   }
// // };

// // module.exports = { blogController, upload };
// const mongoose = require("mongoose");
// const Blog = require("../models/Blog");

// const createBlog = async (req, res) => {
//   try {
//     console.log("Received request body:", req.body);

//     const { title, content, place, date, userId } = req.body;

//     // Validate userId before proceeding
//     if (!userId) {
//       return res.status(400).json({ error: "userId is required" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ error: "Invalid userId format" });
//     }

//     const blog = new Blog({ title, content, place, date, userId });
//     await blog.save();

//     res.status(201).json(blog);
//   } catch (error) {
//     console.error("Error in createBlog:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { createBlog };
const Blog = require('../models/Blog');
const Category = require('../models/Category');

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('category', 'name')
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('category', 'name')
      .populate('author', 'name email')
      .populate('comments.user', 'name profilePicture');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add comment to blog
exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    blog.comments.unshift(req.body);
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Like blog
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }
    
    blog.likes += 1;
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get blogs by category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    const blogs = await Blog.find({ category: category._id })
      .populate('category', 'name')
      .populate('author', 'name email')
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

// Get recommended blogs
exports.getRecommendedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ views: -1, likes: -1 })
      .limit(5)
      .populate('category', 'name')
      .populate('author', 'name');
    
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

