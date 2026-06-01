/**
 * AI Service — all OpenAI interactions live here
 * Controllers call these methods; no raw OpenAI calls outside this file
 */

const { chat } = require('../config/openai');
const prompts = require('../prompts');

/**
 * Generate interview questions for a given mode and user profile
 * @param {string} mode  - 'hr' | 'dsa' | 'system-design' | 'behavioral' | 'coding'
 * @param {object} user  - Mongoose user document
 * @returns {string[]}   - Array of question strings
 */
const generateQuestions = async (mode, user) => {
  const systemPrompt = prompts.questionGenerator(mode, user);

  const raw = await chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Generate the questions now. Return ONLY a JSON array of strings.' },
  ], { temperature: 0.8, max_tokens: 800 });

  try {
    // Strip markdown fences if present
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback: split by newline if JSON parse fails
    return raw.split('\n').filter(Boolean).slice(0, 5);
  }
};

/**
 * Generate AI interviewer response after a user answers
 * @param {string} mode
 * @param {Array}  messageHistory  - Full conversation so far
 * @param {string[]} questions     - All questions for this session
 * @param {number} currentIndex    - Which question was just answered
 */
const getInterviewResponse = async (mode, messageHistory, questions, currentIndex) => {
  const isLast = currentIndex >= questions.length - 1;

  const systemPrompt = prompts.interviewerSystem(mode, isLast);

  // Build OpenAI message array from stored history
  const messages = [
    { role: 'system', content: systemPrompt },
    ...messageHistory.map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  if (!isLast) {
    messages.push({
      role: 'user',
      content: `[SYSTEM: Next question is: "${questions[currentIndex + 1]}". Briefly acknowledge the answer, give one sentence of feedback, then ask this next question naturally.]`,
    });
  } else {
    messages.push({
      role: 'user',
      content: '[SYSTEM: This was the last question. Wrap up the interview warmly. Tell the candidate feedback is being generated.]',
    });
  }

  return chat(messages, { temperature: 0.7, max_tokens: 400 });
};

/**
 * Generate comprehensive end-of-interview feedback
 * @param {Array}  messageHistory
 * @param {string} mode
 * @returns {object} - Full feedback object matching Interview.feedback schema
 */
const generateFeedback = async (messageHistory, mode) => {
  const systemPrompt = prompts.feedbackGenerator(mode);

  const conversation = messageHistory
    .map((m) => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
    .join('\n\n');

  const raw = await chat([
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Here is the full interview transcript:\n\n${conversation}\n\nGenerate comprehensive feedback as JSON.`,
    },
  ], { temperature: 0.4, max_tokens: 2000 });

  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    // Return a safe default if JSON parse fails
    return {
      scores: { overall: 70, technical: 70, communication: 70, hr: 70, clarity: 70, confidence: 70, depth: 70 },
      strengths: ['Participated in the full interview', 'Showed willingness to engage'],
      weaknesses: ['Could not fully parse AI feedback — please retry'],
      improvements: ['Complete more practice sessions'],
      roadmap: [],
      summary: raw,
    };
  }
};

/**
 * Analyse resume text and return structured insights
 * @param {string} resumeText
 * @param {string} targetRole
 */
const analyseResume = async (resumeText, targetRole = 'Software Engineer') => {
  const raw = await chat([
    { role: 'system', content: prompts.resumeAnalyser(targetRole) },
    { role: 'user', content: `Resume text:\n\n${resumeText}\n\nAnalyse and return JSON.` },
  ], { temperature: 0.3, max_tokens: 2000 });

  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

/**
 * Evaluate a code submission
 * @param {string} code
 * @param {string} language
 * @param {string} problemTitle
 * @param {string} problemDescription
 */
const evaluateCode = async (code, language, problemTitle, problemDescription) => {
  const raw = await chat([
    { role: 'system', content: prompts.codeEvaluator() },
    {
      role: 'user',
      content: `Problem: ${problemTitle}\n\nDescription: ${problemDescription}\n\nLanguage: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nEvaluate and return JSON.`,
    },
  ], { temperature: 0.2, max_tokens: 1000 });

  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { generateQuestions, getInterviewResponse, generateFeedback, analyseResume, evaluateCode };
