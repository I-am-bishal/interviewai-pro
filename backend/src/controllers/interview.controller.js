const Interview = require('../models/Interview.model');
const User = require('../models/User.model');
const aiService = require('../services/ai.service');
const { success, created, notFound, badRequest } = require('../utils/response');

/**
 * POST /api/interviews/start
 * Creates a new interview session and generates the first batch of questions
 */
const startInterview = async (req, res) => {
  const { mode, title, level } = req.body;

  // Generate initial questions via AI
  const questions = await aiService.generateQuestions(mode, req.user, level);

  const interview = await Interview.create({
    user: req.user._id,
    mode,
    title: title || `${mode.toUpperCase()} Interview — ${new Date().toLocaleDateString()}`,
    questions,
    messages: [
      {
        role: 'ai',
        content: `Hello ${req.user.name}! I'm your AI interviewer today. We'll be doing a ${mode} interview session. I've prepared ${questions.length} questions for you. Let's begin!`,
      },
    ],
  });

  return created(res, { interview }, 'Interview session started');
};

/**
 * POST /api/interviews/:id/answer
 * Submit an answer; AI responds with follow-up or next question + live feedback
 */
const submitAnswer = async (req, res) => {
  const { answer, questionIndex } = req.body;
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) return notFound(res, 'Interview not found');

  // Push user message
  interview.messages.push({ role: 'user', content: answer });

  // Get AI response / follow-up
  const aiResponse = await aiService.getInterviewResponse(
    interview.mode,
    interview.messages,
    interview.questions,
    questionIndex
  );

  interview.messages.push({ role: 'ai', content: aiResponse });
  interview.questionsAnswered = Math.max(interview.questionsAnswered, questionIndex + 1);
  await interview.save();

  return success(res, { aiResponse, interview });
};

/**
 * POST /api/interviews/:id/complete
 * Finishes the session and generates comprehensive AI feedback
 */
const completeInterview = async (req, res) => {
  const { durationSeconds, fillerWordCount, avgResponseTimeSeconds } = req.body;
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) return notFound(res, 'Interview not found');
  if (interview.status === 'completed') return badRequest(res, 'Interview already completed');

  // Generate full AI feedback
  const feedback = await aiService.generateFeedback(interview.messages, interview.mode);

  interview.status = 'completed';
  interview.durationSeconds = durationSeconds;
  interview.fillerWordCount = fillerWordCount;
  interview.avgResponseTimeSeconds = avgResponseTimeSeconds;
  interview.feedback = feedback;
  interview.completedAt = new Date();
  await interview.save();

  // Update user XP and streak
  await updateUserProgress(req.user._id, feedback.scores?.overall || 0);

  return success(res, { interview }, 'Interview completed');
};

/**
 * GET /api/interviews
 * List all interviews for the authenticated user (paginated)
 */
const listInterviews = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const mode = req.query.mode;

  const filter = { user: req.user._id };
  if (mode) filter.mode = mode;

  const [interviews, total] = await Promise.all([
    Interview.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-messages'), // exclude chat history from list view
    Interview.countDocuments(filter),
  ]);

  return success(res, {
    interviews,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

/**
 * GET /api/interviews/:id
 * Get a single interview with full message history
 */
const getInterview = async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) return notFound(res, 'Interview not found');
  return success(res, { interview });
};

/**
 * DELETE /api/interviews/:id
 */
const deleteInterview = async (req, res) => {
  const interview = await Interview.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!interview) return notFound(res, 'Interview not found');
  return success(res, {}, 'Interview deleted');
};

// ── Helpers ────────────────────────────────────────────────────────────────

async function updateUserProgress(userId, score) {
  const xpGained = Math.round(score * 2); // 0-200 XP per interview
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const user = await User.findById(userId);
  if (!user) return;

  user.xp += xpGained;

  // Streak logic
  const lastDate = user.lastInterviewDate ? new Date(user.lastInterviewDate) : null;
  if (lastDate) {
    lastDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      user.currentStreak += 1;
    } else if (diffDays > 1) {
      user.currentStreak = 1;
    }
    // diffDays === 0 → same day, keep streak
  } else {
    user.currentStreak = 1;
  }

  user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
  user.lastInterviewDate = new Date();
  await user.save({ validateBeforeSave: false });
}

module.exports = { startInterview, submitAnswer, completeInterview, listInterviews, getInterview, deleteInterview };
