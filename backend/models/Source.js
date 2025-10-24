/**
 * Source Model
 * Schema for uploaded study materials (PDFs, notes, text files)
 */

const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'text', 'doc', 'other']
  },
  content: {
    type: String,
    required: true
  },
  fileData: {
    type: Buffer, // Store actual file data
    required: false
  },
  fileSize: {
    type: Number, // Size in bytes
    required: false
  },
  mimeType: {
    type: String,
    required: false
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  summary: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
sourceSchema.index({ subject: 1, uploadDate: -1 });
sourceSchema.index({ filename: 'text', content: 'text' });

module.exports = mongoose.model('Source', sourceSchema);
