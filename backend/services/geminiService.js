/**
 * Gemini AI Service
 * Handles all interactions with Google Gemini API
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System instruction for the AI
const SYSTEM_INSTRUCTION = `You are an intelligent study assistant for students. Your role is to:
1. Help students understand their study materials
2. Answer questions clearly and concisely
3. Generate summaries, quizzes, flashcards, and timelines
4. Provide explanations in a student-friendly manner
5. Encourage learning and critical thinking

Always be helpful, encouraging, and educational. If you don't know something, admit it honestly.`;

/**
 * Generate a response from Gemini AI
 * @param {string} userMessage - The user's message
 * @param {Array} chatHistory - Previous chat messages (optional)
 * @param {string} context - Additional context from sources (optional)
 * @returns {Promise<string>} AI response
 */
async function generateResponse(userMessage, chatHistory = [], context = '') {
  try {
    // Use gemini-2.5-flash model for text generation
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build the conversation history
    let prompt = SYSTEM_INSTRUCTION + '\n\n';

    // Add context from uploaded sources if available
    if (context) {
      prompt += `Context from student's study materials:\n${context}\n\n`;
    }

    // Add chat history
    if (chatHistory.length > 0) {
      prompt += 'Previous conversation:\n';
      chatHistory.forEach(msg => {
        const role = msg.role === 'user' ? 'Student' : 'Assistant';
        prompt += `${role}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    // Add current message
    prompt += `Student: ${userMessage}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error('Failed to generate AI response: ' + error.message);
  }
}

/**
 * Generate a summary from content
 * @param {string} content - The content to summarize
 * @param {string} length - Summary length (short/medium/long)
 * @returns {Promise<string>} Summary
 */
async function generateSummary(content, length = 'medium') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const lengthGuide = {
      short: '100-200 words',
      medium: '300-500 words',
      long: '500-800 words'
    };

    const prompt = `Please provide a ${length} summary (${lengthGuide[length]}) of the following content. 
Focus on the key points, main ideas, and important details that a student should remember.

Content:
${content}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Summary Generation Error:', error);
    throw new Error('Failed to generate summary: ' + error.message);
  }
}

/**
 * Generate quiz questions from content
 * @param {string} content - The content to generate quiz from
 * @param {number} numQuestions - Number of questions to generate
 * @returns {Promise<Array>} Array of quiz questions
 */
async function generateQuiz(content, numQuestions = 10) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Generate ${numQuestions} multiple-choice questions from the following content.
Each question should have 4 options (A, B, C, D) with only one correct answer.
Format the response as a JSON array with the following structure:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation of why this is correct"
  }
]

Content:
${content}

JSON Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse quiz questions');
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    throw new Error('Failed to generate quiz: ' + error.message);
  }
}

/**
 * Generate flashcards from content
 * @param {string} content - The content to generate flashcards from
 * @param {number} numCards - Number of flashcards to generate
 * @returns {Promise<Array>} Array of flashcards
 */
async function generateFlashcards(content, numCards = 15) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Generate ${numCards} flashcards from the following content.
Each flashcard should have a front (question/term) and back (answer/definition).
Format the response as a JSON array with the following structure:
[
  {
    "front": "Question or term",
    "back": "Answer or definition"
  }
]

Content:
${content}

JSON Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse flashcards');
  } catch (error) {
    console.error('Flashcard Generation Error:', error);
    throw new Error('Failed to generate flashcards: ' + error.message);
  }
}

/**
 * Generate timeline from content
 * @param {string} content - The content to generate timeline from
 * @returns {Promise<Array>} Array of timeline events
 */
async function generateTimeline(content) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Extract chronological events from the following content and create a timeline.
Format the response as a JSON array with the following structure:
[
  {
    "date": "Date or time period",
    "title": "Event title",
    "description": "Brief description of the event",
    "category": "Category (e.g., political, scientific, cultural)"
  }
]

Content:
${content}

JSON Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse timeline events');
  } catch (error) {
    console.error('Timeline Generation Error:', error);
    throw new Error('Failed to generate timeline: ' + error.message);
  }
}

module.exports = {
  generateResponse,
  generateSummary,
  generateQuiz,
  generateFlashcards,
  generateTimeline
};
