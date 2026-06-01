const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { protect } = require('../middleware/auth.middleware');
const { success } = require('../utils/response');

router.use(protect);

/** GET /api/users/profile */
router.get('/profile', (req, res) => success(res, { user: req.user.toPublicJSON() }));

/** PUT /api/users/profile */
router.put('/profile', async (req, res) => {
  const allowed = ['name', 'targetRole', 'experienceLevel'];
  const updates = {};
  allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  return success(res, { user: user.toPublicJSON() }, 'Profile updated');
});

/** PUT /api/users/password */
router.put('/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  user.password = newPassword;
  await user.save();
  return success(res, {}, 'Password updated');
});

module.exports = router;
