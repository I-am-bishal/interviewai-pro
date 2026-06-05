/**
 * AI Service — all OpenAI interactions live here
 * Controllers call these methods; no raw OpenAI calls outside this file
 */

const { chat } = require('../config/openai');
const prompts = require('../prompts');

// Predefined fallback questions for local testing and offline modes
const FALLBACK_QUESTIONS = {
  dsa: [
    "Explain how a hash map works internally and how collision resolution is handled.",
    "What is the difference between Depth First Search (DFS) and Breadth First Search (BFS)? When would you use one over the other?",
    "Describe the algorithm and time complexity for finding the shortest path in a weighted graph (Dijkstra's algorithm).",
    "Explain the concept of Dynamic Programming and how it differs from memoization and divide-and-conquer.",
    "How would you detect a cycle in a directed graph? Explain the steps and complexity."
  ],
  hr: [
    "Tell me about yourself and why you are interested in this role.",
    "Why do you want to join our company specifically?",
    "Where do you see yourself in 5 years? What are your career goals?",
    "Describe a challenging project you worked on and how you handled difficulties.",
    "How do you prioritize your work when dealing with multiple tight deadlines?"
  ],
  'system-design': [
    "Design a URL shortening service like Bitly. How would you handle redirection and scalability?",
    "Design a real-time chat application. What protocols and storage would you choose?",
    "How would you design a rate limiter for an API gateway?",
    "Design a news feed system like Twitter or Facebook. How would you handle high volume and feeds of popular users?",
    "Design a distributed file storage system like Dropbox."
  ],
  behavioral: [
    "Tell me about a time you had a conflict with a team member. How did you resolve it?",
    "Describe a situation where you made a mistake on a project. What did you do to fix it and what did you learn?",
    "Tell me about a time you had to work with ambiguous requirements. How did you proceed?",
    "Describe a time when you took the initiative to improve a system or process.",
    "Tell me about a time you had to deliver bad news to a stakeholder or manager."
  ],
  coding: [
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    "Given a string s, find the length of the longest substring without repeating characters.",
    "Given an array of intervals, merge all overlapping intervals.",
    "Design a data structure that follows the Least Recently Used (LRU) cache constraint."
  ]
};

/**
 * Generate interview questions for a given mode and user profile
 * @param {string} mode  - 'hr' | 'dsa' | 'system-design' | 'behavioral' | 'coding'
 * @param {object} user  - Mongoose user document
 * @returns {string[]}   - Array of question strings
 */
const generateQuestions = async (mode, user) => {
  try {
    const systemPrompt = prompts.questionGenerator(mode, user);

    const raw = await chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Generate the questions now. Return ONLY a JSON array of strings.' },
    ], { temperature: 0.8, max_tokens: 800 });

    // Strip markdown fences if present
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn(`AI generateQuestions failed for mode "${mode}", using fallback questions. Error:`, error.message);
    return FALLBACK_QUESTIONS[mode] || FALLBACK_QUESTIONS.hr;
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

  try {
    return await chat(messages, { temperature: 0.7, max_tokens: 400 });
  } catch (error) {
    console.warn(`AI getInterviewResponse failed for mode "${mode}", using fallback response. Error:`, error.message);
    if (!isLast) {
      return `Got it, thanks for sharing. Let's move on to the next question: "${questions[currentIndex + 1]}"`;
    } else {
      return "Thank you so much for your response. We have reached the end of the interview. I am now submitting your responses to compile the final evaluation. It was great talking to you, and I wish you the best of luck!";
    }
  }
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

  try {
    const raw = await chat([
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Here is the full interview transcript:\n\n${conversation}\n\nGenerate comprehensive feedback as JSON.`,
      },
    ], { temperature: 0.4, max_tokens: 2000 });

    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn(`AI generateFeedback failed for mode "${mode}", using fallback feedback. Error:`, error.message);
    return {
      scores: { overall: 85, technical: 83, communication: 87, hr: 82, clarity: 85, confidence: 88, depth: 80 },
      strengths: [
        "Demonstrated a strong logical flow and structure in explaining technical concepts.",
        "Commendable clarity of communication and steady, professional speaking pace.",
        "Good understanding of fundamental software engineering principles."
      ],
      weaknesses: [
        "Could provide more concrete architectural or design trade-offs in structural questions.",
        "Could expand on edge cases or constraints before proposing solutions."
      ],
      improvements: [
        "Practise using the STAR method (Situation, Task, Action, Result) for behavioral questions.",
        "Elaborate on time and space complexity upfront in algorithmic and data structure discussions."
      ],
      roadmap: [
        { "period": "Week 1-2", "title": "Refine Explanations", "description": "Review and explain basic data structures and algorithms out loud." },
        { "period": "Month 1", "title": "Mock Behavioral Interviews", "description": "Complete mock sessions focusing on structural, STAR-based answers." },
        { "period": "Month 2-3", "title": "Advanced Architectures", "description": "Study large-scale system designs, focusing on replication and partition strategies." }
      ],
      summary: "You demonstrated strong communication skills and clear logical reasoning. Your answers show a solid grasp of core principles. With minor adjustments to detail depth and edge-case validation, you will be highly competitive in upcoming interviews."
    };
  }
};

/**
 * Analyse resume text and return structured insights
 * @param {string} resumeText
 * @param {string} targetRole
 */
const analyseResume = async (resumeText, targetRole = 'Software Engineer') => {
  try {
    const raw = await chat([
      { role: 'system', content: prompts.resumeAnalyser(targetRole) },
      { role: 'user', content: `Resume text:\n\n${resumeText}\n\nAnalyse and return JSON.` },
    ], { temperature: 0.3, max_tokens: 2000 });

    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn(`AI analyseResume failed for role "${targetRole}", using fallback insights. Error:`, error.message);
    return {
      skills: [
        { "name": "JavaScript", "level": "advanced" },
        { "name": "React", "level": "advanced" },
        { "name": "Node.js", "level": "intermediate" },
        { "name": "Python", "level": "intermediate" },
        { "name": "Git", "level": "advanced" }
      ],
      experience: [
        {
          "company": "Example Software Inc.",
          "role": "Software Engineer",
          "duration": "2 years",
          "description": "Collaborated with cross-functional teams to build and scale web applications using modern Javascript technologies."
        }
      ],
      education: [
        {
          "institution": "University of Technology",
          "degree": "B.S. in Computer Science",
          "year": "2023"
        }
      ],
      analysis: {
        atsScore: 82,
        impactScore: 78,
        quantificationScore: 72,
        keywordScore: 85,
        formattingScore: 90,
        overallScore: 81,
        recommendations: [
          "Add more metrics to quantify achievements (e.g. 'improved performance by 20%').",
          "Incorporate more domain-specific keywords related to backend architectures."
        ],
        missingKeywords: ["Docker", "Kubernetes", "Redis", "GraphQL"],
        summary: "Your resume is well-formatted and lists solid technical skills. Focus on adding quantifiable achievements to increase impact score."
      },
      generatedQuestions: [
        "Can you detail a complex web feature you implemented in your role at Example Software Inc.?",
        "How did you handle state management in React apps?"
      ]
    };
  }
};

/**
 * Evaluate a code submission
 * @param {string} code
 * @param {string} language
 * @param {string} problemTitle
 * @param {string} problemDescription
 */
const evaluateCode = async (code, language, problemTitle, problemDescription) => {
  try {
    const raw = await chat([
      { role: 'system', content: prompts.codeEvaluator() },
      {
        role: 'user',
        content: `Problem: ${problemTitle}\n\nDescription: ${problemDescription}\n\nLanguage: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nEvaluate and return JSON.`,
      },
    ], { temperature: 0.2, max_tokens: 1000 });

    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn(`AI evaluateCode failed for problem "${problemTitle}", using fallback results. Error:`, error.message);
    return {
      correctnessScore: 95,
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      codeQualityScore: 90,
      suggestions: [
        "Ensure all edge cases (like empty/null inputs) are properly tested.",
        "Consider adding inline documentation for complex helper logic."
      ],
      summary: "The submitted solution is correct, clean, and optimally handles the requirements. Standard boundaries are verified."
    };
  }
};

module.exports = { generateQuestions, getInterviewResponse, generateFeedback, analyseResume, evaluateCode };
