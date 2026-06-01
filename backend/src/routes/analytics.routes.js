const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview.model');
const CodingSubmission = require('../models/CodingSubmission.model');
const { protect } = require('../middleware/auth.middleware');
const { success } = require('../utils/response');

router.use(protect);

/**
 * GET /api/analytics/summary
 * Overall stats for the dashboard
 */
router.get('/summary', async (req, res) => {
  const userId = req.user._id;

  const [interviews, codingSubmissions] = await Promise.all([
    Interview.find({ user: userId, status: 'completed' }).select('feedback.scores mode createdAt durationSeconds'),
    CodingSubmission.find({ user: userId }).select('status createdAt'),
  ]);

  const totalInterviews = interviews.length;
  const avgScore = totalInterviews > 0
    ? Math.round(interviews.reduce((sum, i) => sum + (i.feedback?.scores?.overall || 0), 0) / totalInterviews)
    : 0;

  const scoresByMode = {};
  interviews.forEach((i) => {
    if (!scoresByMode[i.mode]) scoresByMode[i.mode] = { total: 0, count: 0 };
    scoresByMode[i.mode].total += i.feedback?.scores?.overall || 0;
    scoresByMode[i.mode].count++;
  });
  const avgScoreByMode = Object.fromEntries(
    Object.entries(scoresByMode).map(([mode, data]) => [mode, Math.round(data.total / data.count)])
  );

  return success(res, {
    totalInterviews,
    avgScore,
    avgScoreByMode,
    currentStreak: req.user.currentStreak,
    longestStreak: req.user.longestStreak,
    xp: req.user.xp,
    codingAccepted: codingSubmissions.filter((s) => s.status === 'accepted').length,
    codingTotal: codingSubmissions.length,
  });
});

/**
 * GET /api/analytics/trend?days=30
 * Score trend over N days for the chart
 */
router.get('/trend', async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const interviews = await Interview.find({
    user: req.user._id,
    status: 'completed',
    createdAt: { $gte: since },
  }).select('feedback.scores createdAt').sort({ createdAt: 1 });

  const trend = interviews.map((i) => ({
    date: i.createdAt.toISOString().split('T')[0],
    score: i.feedback?.scores?.overall || 0,
  }));

  return success(res, { trend });
});

/**
 * GET /api/analytics/leaderboard
 */
router.get('/leaderboard', async (req, res) => {
  const leaders = await require('../models/User.model')
    .find({ isActive: true })
    .sort({ xp: -1 })
    .limit(20)
    .select('name xp currentStreak longestStreak badges');

  return success(res, { leaders });
});

module.exports = router;
