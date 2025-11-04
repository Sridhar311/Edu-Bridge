const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { signup, login, getProfile, logout, updateProfile } = require('../controllers/authController');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', signup);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', login);

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, getProfile);

// @desc    Update current user profile (name only)
// @route   PATCH /api/auth/profile
// @access  Private
router.patch('/profile', protect, updateProfile);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, logout);

module.exports = router;

