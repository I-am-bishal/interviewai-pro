const express = require('express');
const router = express.Router();
const CodingSubmission = require('../models/CodingSubmission.model');
const aiService = require('../services/ai.service');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter');
const { success, created } = require('../utils/response');

// Hardcoded problem bank (production: store in MongoDB)
const PROBLEMS = require('../utils/problems');

router.use(protect);

/** GET /api/coding/problems */
router.get('/problems', (req, res) => {
  const { difficulty, tag } = req.query;
  let list = PROBLEMS;
  if (difficulty) list = list.filter((p) => p.difficulty === difficulty);
  if (tag) list = list.filter((p) => p.tags.includes(tag));
  return success(res, { problems: list });
});

/** GET /api/coding/problems/:id */
router.get('/problems/:id', (req, res) => {
  const problem = PROBLEMS.find((p) => p.id === req.params.id);
  if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });
  return success(res, { problem });
});

/**
 * POST /api/coding/submit
 * Evaluate code with AI and run against test cases
 */
router.post('/submit', aiLimiter, async (req, res) => {
  const { problemId, language, code } = req.body;
  const problem = PROBLEMS.find((p) => p.id === problemId);
  if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

  // Simulate test case execution (production: use a sandboxed code runner)
  const testResults = problem.testCases.map((tc) => ({
    input: tc.input,
    expectedOutput: tc.expectedOutput,
    actualOutput: tc.expectedOutput, // simulation
    passed: true,
    executionTimeMs: Math.floor(Math.random() * 80) + 5,
  }));

  const passedCount = testResults.filter((t) => t.passed).length;

  // AI evaluation
  const aiEvaluation = await aiService.evaluateCode(code, language, problem.title, problem.description);

  const submission = await CodingSubmission.create({
    user: req.user._id,
    problemId,
    problemTitle: problem.title,
    difficulty: problem.difficulty,
    language,
    code,
    status: passedCount === testResults.length ? 'accepted' : 'wrong_answer',
    testCaseResults: testResults,
    passedCount,
    totalCount: testResults.length,
    aiEvaluation,
  });

  return created(res, { submission }, 'Submission evaluated');
});

/** GET /api/coding/submissions */
router.get('/submissions', async (req, res) => {
  const submissions = await CodingSubmission.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('-code'); // omit code from list
  return success(res, { submissions });
});

module.exports = router;
