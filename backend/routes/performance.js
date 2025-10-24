/**
 * Performance Routes
 * Handles quiz scores and performance tracking
 */

const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// @route   GET /api/performance
// @desc    Get user performance data
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get all completed quizzes
    const quizzes = await Quiz.find({ isCompleted: true })
      .select('-questions')
      .sort({ completedAt: -1 });

    // Calculate stats
    let totalAttempts = quizzes.length;
    let averageScore = 0;
    let highestScore = 0;
    let lowestScore = 0;

    if (totalAttempts > 0) {
      const scores = quizzes.map(q => q.percentage);
      averageScore = (scores.reduce((a, b) => a + b, 0) / totalAttempts).toFixed(1);
      highestScore = Math.max(...scores);
      lowestScore = Math.min(...scores);
    }

    res.json({
      success: true,
      data: {
        quizzes: quizzes,
        stats: {
          totalAttempts,
          averageScore: parseFloat(averageScore),
          highestScore,
          lowestScore
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/performance/quiz/:id
// @desc    Get specific quiz performance
// @access  Public
router.get('/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
