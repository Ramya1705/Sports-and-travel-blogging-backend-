const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

// Get user blogs
router.get('/:id/blogs', userController.getUserBlogs);

// Add blog to favorites
router.put('/:userId/favorites/:blogId', userController.addToFavorites);

// Remove blog from favorites
router.delete('/:userId/favorites/:blogId', userController.removeFromFavorites);

// Get user favorites
router.get('/:id/favorites', userController.getFavorites);

module.exports = router;