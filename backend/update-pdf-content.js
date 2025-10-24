/**
 * Script to re-extract PDF content for existing sources
 */

const mongoose = require('mongoose');
const pdfParse = require('pdf-parse');
const Source = require('./models/Source');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/first-rank-raju')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

async function updatePDFContent() {
  try {
    console.log('🔍 Finding PDF sources without extracted content...\n');
    
    const pdfSources = await Source.find({
      fileType: 'pdf',
      $or: [
        { content: 'PDF content extraction coming soon. File stored.' },
        { content: 'PDF content extraction failed. File stored.' }
      ]
    });
    
    console.log(`Found ${pdfSources.length} PDF(s) to process\n`);
    
    for (const source of pdfSources) {
      console.log(`📄 Processing: ${source.filename}...`);
      
      if (!source.fileData) {
        console.log('   ⚠️  No file data available, skipping\n');
        continue;
      }
      
      try {
        const pdfData = await pdfParse(source.fileData);
        source.content = pdfData.text;
        
        await source.save();
        
        console.log(`   ✅ Extracted ${pdfData.text.length} characters`);
        console.log(`   📊 Pages: ${pdfData.numpages}`);
        console.log(`   Preview: ${pdfData.text.substring(0, 150)}...\n`);
      } catch (pdfError) {
        console.error(`   ❌ Extraction failed:`, pdfError.message);
        source.content = 'PDF content extraction failed. File stored.';
        await source.save();
        console.log('');
      }
    }
    
    console.log('✅ PDF content update complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updatePDFContent();
