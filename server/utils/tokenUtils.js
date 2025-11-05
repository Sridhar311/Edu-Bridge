const jwt = require('jsonwebtoken');

/**
 * Sign JWT token with user data
 * @param {Object} user - User object with id, role, email
 * @returns {String} JWT token
 */
const signToken = (user) => {
  return jwt.sign(
    { 
      id: user.id || user._id, 
      role: user.role, 
      email: user.email 
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

/**
 * Set JWT token as httpOnly cookie
 * @param {Object} res - Express response object
 * @param {String} token - JWT token
 */
const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Prevents XSS attacks
    secure: isProd, // HTTPS only in production
    sameSite: isProd ? 'none' : 'lax', // cross-site cookie for production (Vercel → Render)
    path: '/',
  };

  res.cookie('token', token, cookieOptions);
};

/**
 * Clear auth cookie (for logout)
 * @param {Object} res - Express response object
 */
const clearAuthCookie = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
};

module.exports = {
  signToken,
  setAuthCookie,
  clearAuthCookie,
};
