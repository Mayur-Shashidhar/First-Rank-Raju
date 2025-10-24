/**
 * Study Tools Routes
 * Handles quiz, summary, timeline, and flashcard generation
 */

const express = require('express');
const router = express.Router();
const Source = require('../models/Source');
const Quiz = require('../models/Quiz');
const Flashcard = require('../models/Flashcard');
const Timeline = require('../models/Timeline');
const { 
  generateSummary, 
  generateQuiz, 
  generateFlashcards, 
  generateTimeline 
} = require('../services/geminiService');

// @route   POST /api/tools/quiz/generate
// @desc    Generate quiz from content
// @access  Public
router.post('/quiz/generate', async (req, res) => {
  try {
    const { sourceId, numQuestions = 10 } = req.body;

    if (!sourceId) {
      return res.status(400).json({
        success: false,
        message: 'Source ID is required'
      });
    }

    // Get source content
    const source = await Source.findById(sourceId);
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found'
      });
    }

    // Generate quiz questions using AI
    const questions = await generateQuiz(source.content, numQuestions);

    // Create quiz in database
    const quiz = new Quiz({
      title: `Quiz: ${source.filename}`,
      subject: source.subject,
      sourceId: source._id,
      questions: questions,
      totalQuestions: questions.length
    });

    await quiz.save();

    res.json({
      success: true,
      message: 'Quiz generated successfully',
      data: {
        quizId: quiz._id,
        title: quiz.title,
        subject: quiz.subject,
        totalQuestions: quiz.totalQuestions,
        questions: quiz.questions.map(q => ({
          _id: q._id,
          question: q.question,
          options: q.options
          // Don't send correct answer yet
        }))
      }
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/tools/quiz/history
// @desc    Get quiz history (completed quizzes only)
// @access  Public
router.get('/quiz/history', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isCompleted: true })
      .select('title subject score percentage totalQuestions completedAt createdAt')
      .sort({ completedAt: -1 });

    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/tools/quiz/:id/review
// @desc    Get detailed quiz review with all answers
// @access  Public
router.get('/quiz/:id/review', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (!quiz.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Quiz not yet completed'
      });
    }

    res.json({
      success: true,
      data: {
        title: quiz.title,
        subject: quiz.subject,
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        percentage: quiz.percentage,
        completedAt: quiz.completedAt,
        questions: quiz.questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          selectedAnswer: q.selectedAnswer,
          isCorrect: q.selectedAnswer === q.correctAnswer,
          explanation: q.explanation
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/tools/quiz/:id
// @desc    Get quiz by ID
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

    // Don't send correct answers if quiz is not completed
    const quizData = quiz.toObject();
    if (!quiz.isCompleted) {
      quizData.questions = quizData.questions.map(q => ({
        question: q.question,
        options: q.options,
        _id: q._id
      }));
    }

    res.json({
      success: true,
      data: quizData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/tools/quiz/:id/submit
// @desc    Submit quiz answers and get results
// @access  Public
router.post('/quiz/:id/submit', async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, selectedAnswer }

    console.log('Submitting quiz:', req.params.id);
    console.log('Received answers:', answers);

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (quiz.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Quiz already completed'
      });
    }

    // Update quiz with answers
    let updatedCount = 0;
    answers.forEach(({ questionId, selectedAnswer }) => {
      const question = quiz.questions.id(questionId);
      if (question) {
        question.selectedAnswer = selectedAnswer;
        updatedCount++;
        console.log(`Updated question ${questionId} with answer: ${selectedAnswer}`);
      } else {
        console.log(`Question not found: ${questionId}`);
      }
    });

    console.log(`Updated ${updatedCount} out of ${answers.length} questions`);

    quiz.isCompleted = true;
    quiz.completedAt = new Date();
    await quiz.save();

    console.log(`Quiz saved - Score: ${quiz.score}/${quiz.totalQuestions} (${quiz.percentage}%)`);

    // Return results with questions array
    res.json({
      success: true,
      data: {
        score: quiz.score,
        totalQuestions: quiz.totalQuestions,
        percentage: quiz.percentage,
        questions: quiz.questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          selectedAnswer: q.selectedAnswer,
          explanation: q.explanation
        }))
      }
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/tools/summary
// @desc    Generate summary from uploaded content
// @access  Public
router.post('/summary', async (req, res) => {
  try {
    const { sourceId, length = 'medium' } = req.body;

    if (!sourceId) {
      return res.status(400).json({
        success: false,
        message: 'Source ID is required'
      });
    }

    // Get source content
    const source = await Source.findById(sourceId);
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found'
      });
    }

    // Generate summary using AI
    const summary = await generateSummary(source.content, length);

    // Update source with summary
    source.summary = summary;
    await source.save();

    res.json({
      success: true,
      message: 'Summary generated successfully',
      data: {
        summary: summary,
        length: length
      }
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/tools/quiz
// @desc    Generate quiz from content
// @access  Public
router.post('/quiz', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Quiz generation route working'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/tools/flashcard
// @desc    Create flashcards
// @access  Public
router.post('/flashcard', async (req, res) => {
  try {
    const { sourceId, numCards = 15 } = req.body;

    if (!sourceId) {
      return res.status(400).json({
        success: false,
        message: 'Source ID is required'
      });
    }

    // Get source content
    const source = await Source.findById(sourceId);
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found'
      });
    }

    // Generate flashcards using AI
    const cards = await generateFlashcards(source.content, numCards);

    // Create flashcard set in database
    const flashcardSet = new Flashcard({
      title: `Flashcards: ${source.filename}`,
      subject: source.subject,
      sourceId: source._id,
      cards: cards,
      totalCards: cards.length
    });

    await flashcardSet.save();

    res.json({
      success: true,
      message: 'Flashcards generated successfully',
      data: flashcardSet
    });
  } catch (error) {
    console.error('Flashcard generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/tools/timeline
// @desc    Create timeline from content
// @access  Public
router.post('/timeline', async (req, res) => {
  try {
    const { sourceId } = req.body;

    if (!sourceId) {
      return res.status(400).json({
        success: false,
        message: 'Source ID is required'
      });
    }

    // Get source content
    const source = await Source.findById(sourceId);
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found'
      });
    }

    // Generate timeline using AI
    const events = await generateTimeline(source.content);

    // Create timeline in database
    const timeline = new Timeline({
      title: `Timeline: ${source.filename}`,
      subject: source.subject,
      sourceId: source._id,
      events: events,
      totalEvents: events.length
    });

    await timeline.save();

    res.json({
      success: true,
      message: 'Timeline generated successfully',
      data: timeline
    });
  } catch (error) {
    console.error('Timeline generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
