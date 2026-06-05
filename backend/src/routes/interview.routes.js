const express = require('express');
const router = express.Router();
const {
  startInterview, submitAnswer, completeInterview,
  listInterviews, getInterview, deleteInterview,
} = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');
const { body } = require('express-validator');
const validate = require('../validators/validate');

// All interview routes require authentication
router.use(protect);

router.get('/', listInterviews);
router.post('/start', [
  body('mode').isIn(['hr', 'dsa', 'system-design', 'behavioral', 'coding']),
  body('level').optional().isIn(['entry', 'mid', 'senior', 'lead']),
], validate, startInterview);

router.get('/:id', getInterview);
router.delete('/:id', deleteInterview);
router.post('/:id/answer', [
  body('answer').trim().notEmpty().withMessage('Answer cannot be empty'),
  body('questionIndex').isInt({ min: 0 }),
], validate, submitAnswer);
router.post('/:id/complete', completeInterview);

module.exports = router;
