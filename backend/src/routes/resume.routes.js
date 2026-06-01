const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const Resume = require('../models/Resume.model');
const aiService = require('../services/ai.service');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter');
const { success, created, badRequest } = require('../utils/response');

// Store file in memory (we only need the buffer to extract text)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
});

router.use(protect);

/**
 * POST /api/resume/upload
 * Upload resume → extract text → AI analyse
 */
router.post('/upload', aiLimiter, upload.single('resume'), async (req, res) => {
  if (!req.file) return badRequest(res, 'No file uploaded');

  let rawText = '';
  if (req.file.mimetype === 'application/pdf') {
    const data = await pdf(req.file.buffer);
    rawText = data.text;
  } else {
    // For DOCX — basic buffer-to-string (production: use mammoth)
    rawText = req.file.buffer.toString('utf-8');
  }

  if (rawText.length < 50) return badRequest(res, 'Could not extract text from the file');

  const { targetRole } = req.body;
  const analysis = await aiService.analyseResume(rawText, targetRole || req.user.targetRole);

  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.originalname,
    fileSize: req.file.size,
    rawText,
    ...analysis,
  });

  return created(res, { resume }, 'Resume analysed successfully');
});

/**
 * GET /api/resume
 * Get the user's most recent resume analysis
 */
router.get('/', async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  return success(res, { resume });
});

/**
 * GET /api/resume/all
 */
router.get('/all', async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 }).select('-rawText');
  return success(res, { resumes });
});

module.exports = router;
