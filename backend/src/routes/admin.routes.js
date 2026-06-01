const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const Interview = require('../models/Interview.model');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { success } = require('../utils/response');

router.use(protect, adminOnly);

/** GET /api/admin/users */
router.get('/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(),
  ]);
  return success(res, { users, pagination: { page, limit, total } });
});

/** GET /api/admin/stats */
router.get('/stats', async (req, res) => {
  const [totalUsers, totalInterviews, completedInterviews] = await Promise.all([
    User.countDocuments(),
    Interview.countDocuments(),
    Interview.countDocuments({ status: 'completed' }),
  ]);
  return success(res, { totalUsers, totalInterviews, completedInterviews });
});

/** PUT /api/admin/users/:id/deactivate */
router.put('/users/:id/deactivate', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  return success(res, {}, 'User deactivated');
});

module.exports = router;
