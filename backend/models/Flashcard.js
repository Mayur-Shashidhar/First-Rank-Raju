/**
 * Flashcard Model
 * Schema for flashcard sets
 */

const mongoose = require('mongoose');

const flashcardItemSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true
  },
  back: {
    type: String,
    required: true
  },
  mastered: {
    type: Boolean,
    default: false
  }
});

const flashcardSchema = new mongoose.Schema({
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
  cards: [flashcardItemSchema],
  totalCards: {
    type: Number,
    required: true
  },
  masteredCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update mastered count
flashcardSchema.methods.updateMasteredCount = function() {
  this.masteredCount = this.cards.filter(card => card.mastered).length;
  return this.save();
};

module.exports = mongoose.model('Flashcard', flashcardSchema);
