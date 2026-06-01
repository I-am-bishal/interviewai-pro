const User = require('../models/User.model');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { success, created, badRequest, unauthorized } = require('../utils/response');

/**
 * POST /api/auth/register
 */
const register = async (req, res) => {
  const { name, email, password, targetRole, experienceLevel } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return badRequest(res, 'Email is already registered');

  const user = await User.create({ name, email, password, targetRole, experienceLevel });

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  return created(res, {
    user: user.toPublicJSON(),
    accessToken,
    refreshToken,
  }, 'Account created successfully');
};

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password (it's excluded by default)
  const user = await User.findOne({ email }).select('+password');
  if (!user) return unauthorized(res, 'Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return unauthorized(res, 'Invalid credentials');

  if (!user.isActive) return unauthorized(res, 'Account is deactivated');

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({ id: user._id });

  return success(res, {
    user: user.toPublicJSON(),
    accessToken,
    refreshToken,
  }, 'Login successful');
};

/**
 * POST /api/auth/refresh
 * Rotate the access token using a valid refresh token
 */
const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return badRequest(res, 'Refresh token required');

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) return unauthorized(res, 'Invalid refresh token');

    const newAccessToken = signAccessToken({ id: user._id, role: user.role });
    const newRefreshToken = signRefreshToken({ id: user._id });

    return success(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch {
    return unauthorized(res, 'Invalid or expired refresh token');
  }
};

/**
 * POST /api/auth/logout  (stateless — client drops tokens)
 */
const logout = async (req, res) => {
  return success(res, {}, 'Logged out successfully');
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
  return success(res, { user: req.user.toPublicJSON() });
};

module.exports = { register, login, refresh, logout, getMe };
