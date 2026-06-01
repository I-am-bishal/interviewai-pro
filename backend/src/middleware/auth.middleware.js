const { verifyAccessToken } = require('../utils/jwt');
const { unauthorized } = require('../utils/response');
const User = require('../models/User.model');

/**
 * Protect a route — must have a valid Bearer token
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res, 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    // Attach user (without password) to request
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return unauthorized(res, 'User no longer exists');
    next();
  } catch (err) {
    return unauthorized(res, 'Invalid or expired token');
  }
};

/**
 * Restrict to admin role
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { protect, adminOnly };
