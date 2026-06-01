const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['ai', 'user'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  // Voice-specific metadata
  audioUrl: String,
  confidence: Number, // 0-100
});

const scoreSchema = new mongoose.Schema({
  overall: { type: Number, min: 0, max: 100 },
  technical: { type: Number, min: 0, max: 100 },
  communication: { type: Number, min: 0, max: 100 },
  hr: { type: Number, min: 0, max: 100 },
  clarity: { type: Number, min: 0, max: 100 },
  confidence: { type: Number, min: 0, max: 100 },
  depth: { type: Number, min: 0, max: 100 },
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mode: {
      type: String,
      enum: ['hr', 'dsa', 'system-design', 'behavioral', 'coding'],
      required: true,
    },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },

    // Conversation
    messages: [messageSchema],
    questions: [{ type: String }],

    // AI-generated feedback
    feedback: {
      scores: scoreSchema,
      strengths: [String],
      weaknesses: [String],
      improvements: [String],
      roadmap: [
        {
          period: String,
          title: String,
          description: String,
        },
      ],
      summary: String,
    },

    // Session metadata
    durationSeconds: Number,
    questionsAnswered: { type: Number, default: 0 },
    fillerWordCount: { type: Number, default: 0 },
    avgResponseTimeSeconds: Number,

    // Confidence analysis
    confidenceAnalysis: {
      speakingPace: String, // 'slow' | 'normal' | 'fast'
      pauseFrequency: String,
      sentimentScore: Number,
    },

    completedAt: Date,
  },
  { timestamps: true }
);

// Auto-index for analytics queries
interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ user: 1, mode: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
