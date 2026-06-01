const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter');
const aiService = require('../services/ai.service');
const { success } = require('../utils/response');

router.use(protect);
router.use(aiLimiter); // strict per-user AI rate limit

/**
 * POST /api/ai/hint
 * Get a contextual hint for the current question
 */
router.post('/hint', async (req, res) => {
  const { mode, question } = req.body;
  const hint = await aiService.getHint(mode, question);
  return success(res, { hint });
});

/**
 * POST /api/ai/question
 * Generate a single new question on demand
 */
router.post('/question', async (req, res) => {
  const { mode } = req.body;
  const questions = await aiService.generateQuestions(mode, req.user);
  return success(res, { question: questions[0] });
});

module.exports = router;
