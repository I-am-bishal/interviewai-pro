/**
 * OpenAI client singleton — centralises model config
 */

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

/**
 * Send a chat completion request
 * @param {Array}  messages  - OpenAI message array
 * @param {Object} options   - override temperature, max_tokens, etc.
 */
const chat = async (messages, options = {}) => {
  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    temperature: 0.7,
    max_tokens: 1500,
    ...options,
    messages,
  });

  return response.choices[0].message.content;
};

module.exports = { openai, chat, DEFAULT_MODEL };
