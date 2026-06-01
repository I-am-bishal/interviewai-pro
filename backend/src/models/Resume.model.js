const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: String,
    fileSize: Number,
    rawText: String,

    // Parsed data
    skills: [
      {
        name: String,
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],

    // AI Analysis
    analysis: {
      atsScore: Number,           // 0-100
      impactScore: Number,
      quantificationScore: Number,
      keywordScore: Number,
      formattingScore: Number,
      overallScore: Number,
      recommendations: [String],
      missingKeywords: [String],
      summary: String,
    },

    // AI-generated questions from this resume
    generatedQuestions: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
