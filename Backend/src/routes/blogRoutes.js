// const express = require('express');
// const router = express.Router();
// const { blogController, upload } = require('../controllers/blogController');

// // Get all blogs for a user
// router.get('/:userId', blogController.getUserBlogs);

// // Get single blog
// router.get('/:userId/:blogId', blogController.getBlog);

// // Create new blog
// router.post('/', upload.single('media'), blogController.createBlog);

// module.exports = router;
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Get all blogs
router.get('/', blogController.getAllBlogs);

// Get single blog
router.get('/:id', blogController.getBlogById);

// Create blog
router.post('/', blogController.createBlog);

// Update blog
router.put('/:id', blogController.updateBlog);

// Delete blog
router.delete('/:id', blogController.deleteBlog);

// Add comment to blog
router.post('/:id/comments', blogController.addComment);

// Like blog
router.put('/:id/like', blogController.likeBlog);

// Get blogs by category
router.get('/category/:slug', blogController.getBlogsByCategory);

// Get recommended blogs
router.get('/recommended/top', blogController.getRecommendedBlogs);

module.exports = router;