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
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    path: '/',
  };

  res.cookie('token', token, cookieOptions);
};

/**
 * Clear auth cookie (for logout)
 * @param {Object} res - Express response object
 */
const clearAuthCookie = (res) => {
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
};

module.exports = {
  signToken,
  setAuthCookie,
  clearAuthCookie,
};
