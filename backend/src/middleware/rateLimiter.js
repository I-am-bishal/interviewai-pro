const rateLimit = require('express-rate-limit');

/** General API limiter — 100 req / 15 min */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

/** Strict limiter for AI endpoints — 20 req / 15 min */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AI_RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'AI rate limit exceeded. Please wait before making more AI requests.' },
});

/** Auth limiter — 10 attempts / 15 min */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

module.exports = { generalLimiter, aiLimiter, authLimiter };
