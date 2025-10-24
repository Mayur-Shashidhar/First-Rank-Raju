/**
 * Quiz Model
 * Schema for generated quizzes and attempts
 */

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  selectedAnswer: {
    type: String,
    default: null
  },
  explanation: {
    type: String,
    default: null
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Source',
    default: null
  },
  questions: [questionSchema],
  totalQuestions: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    default: null
  },
  percentage: {
    type: Number,
    default: null
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate score before saving
quizSchema.pre('save', function(next) {
  if (this.isCompleted) {
    let correctCount = 0;
    this.questions.forEach(q => {
      if (q.selectedAnswer === q.correctAnswer) {
        correctCount++;
      }
    });
    this.score = correctCount;
    this.percentage = (correctCount / this.totalQuestions) * 100;
  }
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
