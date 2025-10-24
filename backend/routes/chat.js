/**
 * Chat Routes
 * Handles AI chat with Google Gemini API
 */

const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Source = require('../models/Source');
const { generateResponse } = require('../services/geminiService');

// Helper function to generate session ID
const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// @route   POST /api/chat
// @desc    Send message to Gemini AI and get response
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { message, sessionId, sourceIds } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get or create chat session
    let chatSession;
    if (sessionId) {
      chatSession = await Chat.findOne({ sessionId });
    }

    if (!chatSession) {
      const newSessionId = generateSessionId();
      chatSession = new Chat({
        sessionId: newSessionId,
        messages: []
      });
    }

    // Get context from multiple sources if provided
    let context = '';
    if (sourceIds && Array.isArray(sourceIds) && sourceIds.length > 0) {
      const sources = await Source.find({ _id: { $in: sourceIds } });
      if (sources.length > 0) {
        // Combine content from all sources
        context = sources.map((source, index) => {
          return `\n--- Source ${index + 1}: ${source.filename} (${source.subject}) ---\n${source.content}`;
        }).join('\n\n');
        
        // Set subject as combination or use first source
        chatSession.subject = sources.length === 1 
          ? sources[0].subject 
          : `Multiple Sources (${sources.length})`;
      }
    }

    // Get chat history (last 10 messages for context)
    const chatHistory = chatSession.messages.slice(-10);

    // Generate AI response
    const aiResponse = await generateResponse(message, chatHistory, context);

    // Add user message to chat
    await chatSession.addMessage('user', message);

    // Add AI response to chat
    await chatSession.addMessage('assistant', aiResponse);

    // Get socket.io instance and emit message
    const io = req.app.get('io');
    if (io) {
      io.emit('chat-message', {
        sessionId: chatSession.sessionId,
        message: {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        }
      });
    }

    res.json({
      success: true,
      sessionId: chatSession.sessionId,
      response: aiResponse,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/chat/history/:sessionId
// @desc    Get chat history for a session
// @access  Public
router.get('/history/:sessionId', async (req, res) => {
  try {
    const chatSession = await Chat.findOne({ sessionId: req.params.sessionId });

    if (!chatSession) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: chatSession.sessionId,
        messages: chatSession.messages,
        subject: chatSession.subject
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/chat/sessions
// @desc    Get all chat sessions
// @access  Public
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Chat.find()
      .select('sessionId subject lastActivity createdAt')
      .sort({ lastActivity: -1 })
      .limit(20);

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/chat/:sessionId
// @desc    Delete a chat session
// @access  Public
router.delete('/:sessionId', async (req, res) => {
  try {
    const result = await Chat.findOneAndDelete({ sessionId: req.params.sessionId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
