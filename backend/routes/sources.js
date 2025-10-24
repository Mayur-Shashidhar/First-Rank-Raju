/**
 * Sources Routes
 * Handles file upload, retrieval, and management
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Source = require('../models/Source');

// Configure Multer for file uploads (store in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept text files, PDFs, and documents
    const allowedTypes = /text|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype || extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only text files, PDFs, and documents are allowed!'));
    }
  }
});

// @route   GET /api/sources
// @desc    Get all uploaded sources
// @access  Public
router.get('/', async (req, res) => {
  try {
    const sources = await Source.find()
      .select('-fileData') // Exclude large file data from list
      .sort({ uploadDate: -1 });
    
    res.json({
      success: true,
      count: sources.length,
      data: sources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/sources/:id
// @desc    Get single source by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const source = await Source.findById(req.params.id);
    
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found'
      });
    }
    
    res.json({
      success: true,
      data: source
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/sources/upload
// @desc    Upload a new source file
// @access  Public
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { subject, tags } = req.body;

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required'
      });
    }

    // Extract text content from buffer
    let content = '';
    
    // Determine file type and extract content
    let fileType = 'other';
    if (req.file.mimetype.includes('pdf')) {
      fileType = 'pdf';
      try {
        const pdfData = await pdfParse(req.file.buffer);
        content = pdfData.text;
        console.log(`Extracted ${content.length} characters from PDF`);
      } catch (pdfError) {
        console.error('PDF extraction error:', pdfError);
        content = 'PDF content extraction failed. File stored.';
      }
    } else if (req.file.mimetype.includes('text')) {
      fileType = 'text';
      content = req.file.buffer.toString('utf-8');
    } else if (req.file.mimetype.includes('doc')) {
      fileType = 'doc';
      content = 'Document content extraction coming soon. File stored.';
    } else {
      content = req.file.buffer.toString('utf-8');
    }

    // Create new source
    const newSource = new Source({
      filename: req.file.originalname,
      subject: subject,
      fileType: fileType,
      content: content,
      fileData: req.file.buffer,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    const savedSource = await newSource.save();

    // Return source without large file data
    const sourceResponse = savedSource.toObject();
    delete sourceResponse.fileData;

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: sourceResponse
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/sources/:id
// @desc    Delete a source
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const source = await Source.findByIdAndDelete(req.params.id);
    
    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Source deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
