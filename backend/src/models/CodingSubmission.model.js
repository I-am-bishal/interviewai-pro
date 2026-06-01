const mongoose = require('mongoose');

const testCaseResultSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
  actualOutput: String,
  passed: Boolean,
  executionTimeMs: Number,
});

const codingSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problemId: { type: String, required: true },
    problemTitle: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    language: {
      type: String,
      enum: ['javascript', 'python', 'java', 'cpp', 'typescript'],
      required: true,
    },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'wrong_answer', 'time_limit', 'runtime_error'],
      default: 'pending',
    },
    testCaseResults: [testCaseResultSchema],
    passedCount: Number,
    totalCount: Number,

    // AI evaluation
    aiEvaluation: {
      correctnessScore: Number,
      timeComplexity: String,
      spaceComplexity: String,
      codeQualityScore: Number,
      suggestions: [String],
      summary: String,
    },

    executionTimeMs: Number,
    memoryUsedKB: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('CodingSubmission', codingSubmissionSchema);
