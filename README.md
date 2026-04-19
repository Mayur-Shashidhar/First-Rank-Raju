# 🎓 First Rank Raju - AI-Powered Student Productivity Platform

A comprehensive full-stack MERN application that revolutionizes the way students study with AI-powered tools, intelligent quiz generation, interactive flashcards, performance analytics, and real-time AI assistance.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-blue)
![Real-time](https://img.shields.io/badge/Real--time-Socket.io-orange)
![PDF](https://img.shields.io/badge/PDF-Parsing-red)

## 📖 Course Information

- Course Name : Web Technologies
- Course Code : UE24CS242A

## 🌟 Complete Feature Set

### 📚 Study Material Management

#### File Upload System
- **Drag-and-drop upload modal** with visual feedback
- **PDF text extraction** using `pdf-parse` library
- Automatic content extraction from uploaded PDFs
- Support for multiple file formats (PDF, TXT, DOCX)
- **MongoDB GridFS storage** for file persistence
- Files stored with metadata (filename, subject, upload date)
- Quick access to all uploaded materials

#### Source Organization
- Tag and categorize sources by subject
- View file content directly in the dashboard
- Delete unwanted sources
- Search and filter capabilities
- Chronological sorting by upload date
- Subject-based organization

### 🤖 AI-Powered Chat Assistant

#### Multi-Source Context Chat
- **Select multiple sources** for comprehensive context
- Toggle sources on/off with visual checkmarks
- AI uses content from all selected sources simultaneously
- Clear visual indicators for active contexts
- "Clear All" button to reset source selection
- Individual source removal from active contexts

#### Intelligent Conversation
- Powered by **Google Gemini 2.5 Flash** model
- Context-aware responses based on study materials
- Chat history persistence across sessions
- Session-based conversation tracking
- Real-time message streaming via **Socket.io**
- Auto-scroll to latest messages
- Formatted responses with proper line breaks

#### Chat Interface Features
- Clean, dark-themed UI optimized for reading
- Source selection sidebar with multi-select capability
- Message timestamps
- AI assistant branding with icons
- Loading indicators while AI is thinking
- Error handling with helpful messages
- Mobile-responsive design

### 📝 Quiz Creator

#### AI-Generated Quizzes
- Generate custom quizzes from uploaded materials
- Configurable number of questions (5-50)
- Multiple-choice questions with 4 options
- AI-powered question generation using study content
- Detailed explanations for each answer
- Automatic difficulty balancing

#### Interactive Quiz Interface
- **Progress tracker** showing current question number
- Question navigation (Next/Previous buttons)
- Visual answer selection with hover effects
- Answer marking system
- Submit quiz with confirmation dialog
- Incomplete quiz warning

#### Quiz Scoring & Results
- Automatic scoring with percentage calculation
- **Pre-save hook** in MongoDB for score computation
- Detailed results showing:
  - Total score and percentage
  - Individual question review
  - User's selected answers highlighted
  - Correct answers displayed
  - Explanations for each question
- Color-coded feedback (green for correct, red for incorrect)

#### Quiz History
- **View History** button in Quiz Creator tab
- List of all completed quizzes with:
  - Quiz title and subject
  - Score percentage
  - Completion date
  - Number of questions
- **Detailed quiz review** functionality
- Review past quizzes with all questions and answers
- Navigate back to quiz list easily
- Database persistence of all quiz attempts

### 📋 Summary Generator

#### AI-Powered Summarization
- Generate concise summaries from study materials
- Three length options:
  - **Short**: 2-3 paragraphs
  - **Medium**: 5-7 paragraphs  
  - **Long**: Comprehensive overview
- Context-aware summarization using Gemini AI
- Preserves key concepts and important details
- Formatted for easy reading

#### Summary Features
- Clean, readable text display
- Whitespace preservation for better formatting
- Copy-friendly text output
- Regenerate with different lengths
- Tab-specific success messages

### 🎴 Flashcard Builder

#### AI-Generated Flashcards
- Create interactive study flashcards automatically
- Configurable card count (5-50 cards)
- Front side: Key term or question
- Back side: Definition or answer
- AI extracts important concepts from materials

#### Interactive Flashcard Interface
- **3D flip animation** on click
- Smooth rotation transition (500ms)
- Card counter showing progress (e.g., "Card 1 of 15")
- Navigation controls:
  - Previous card button
  - Next card button
  - Flip card (click anywhere)
- Visual depth with CSS perspective
- Dark-themed cards with proper contrast

#### Flashcard Features
- Tab-specific result messages
- Reset and regenerate functionality
- Flashcard set title display
- Responsive card sizing
- Keyboard-friendly navigation

### 📅 Timeline Extractor

#### Chronological Event Extraction
- AI extracts dates and events from materials
- Automatically creates chronological timeline
- Identifies key milestones and important dates
- Perfect for history, science, or any date-based content

#### Timeline Visualization
- **Vertical timeline** with left border
- Dot markers for each event
- Date/time display for each entry
- Event title and description
- Clean, organized layout
- Color-coded visual elements (blue accent)

#### Timeline Features
- Auto-generated from source content
- Sortable by date
- Expandable event details
- Tab-specific success messages
- Professional timeline design

### 📊 Performance Dashboard

#### Comprehensive Statistics
- **Total Quizzes**: Count of all completed quizzes
- **Average Score**: Mean percentage across all attempts
- **Highest Score**: Best quiz performance
- **Lowest Score**: Shows 0% when no quizzes taken (not 100%)
- Real-time statistics updates
- Color-coded stat cards

#### Quiz History & Analytics
- Complete list of all quiz attempts
- Sortable by date (most recent first)
- Each entry shows:
  - Quiz title
  - Subject
  - Score percentage
  - Completion date
  - Question count
- Visual progress indicators
- Empty state with "Go to Tools" CTA

#### Performance Tracking
- Track improvement over time
- Identify weak subjects
- Review past quiz attempts
- Monitor learning progress
- Subject-based performance breakdown

### 🎨 Dashboard Interface

#### Three-Column Layout
- **Left Sidebar**: Study materials management
  - Upload button prominently displayed
  - List of all sources with metadata
  - Quick actions (view, delete)
  - Subject tags for organization
  
- **Center Panel**: Content display
  - Selected source content viewer
  - Full PDF text display
  - Syntax highlighting for code
  - Scrollable content area
  - Clean reading interface
  
- **Right Sidebar**: Quick tools access
  - Flashcard generator
  - Timeline creator
  - Summary builder
  - Quiz creator
  - Performance tracker
  - One-click tool activation

#### Tool Integration
- **Modal-based tool results** for non-quiz tools
- Direct navigation to Tools page for quizzes
- Source selection validation
- Loading states for async operations
- Success/error message display
- Tool result preview in modals

### 🎯 Navigation System

#### Centered Navigation Bar
- **Dashboard**: Main workspace view
- **Tools**: Dedicated tools page with tabs
- **Chat**: AI assistant interface
- **Performance**: Analytics and history
- Clean, centered navigation
- Active route highlighting
- Blue underline for current page
- Smooth transitions

#### Tab-Based Tools Page
- Four main tabs:
  - Quiz Creator
  - Summary
  - Flashcards
  - Timeline
- Source selector at the top
- Tab-specific result messages (isolated)
- No message bleeding between tabs
- Clean tab switching animations

### ⚡ Real-Time Features

#### Socket.io Integration
- Real-time chat message delivery
- Live notification system
- Instant updates across clients
- Session-based communication
- Connection status monitoring
- Auto-reconnection on disconnect

#### Live Updates
- Quiz results update in real-time
- Performance stats refresh automatically
- Source list updates on upload/delete
- Chat history synchronization

### 🔧 Technical Features

#### PDF Processing
- **pdf-parse v1.1.1** for text extraction
- Buffer-based PDF reading
- Automatic text extraction on upload
- Stores extracted text in MongoDB
- Handles large PDF files efficiently
- Error handling for corrupt PDFs

#### Database Architecture
- **MongoDB** with Mongoose ODM
- Five main schemas:
  1. **Source**: File storage with content extraction
  2. **Quiz**: Questions with subdocuments, pre-save hooks
  3. **Chat**: Session-based message history
  4. **Flashcard**: Card sets with front/back content
  5. **Timeline**: Events with dates and descriptions

#### API Design
- RESTful API architecture
- Consistent response format
- Error handling middleware
- CORS configuration
- Request validation
- JSON responses

#### State Management
- React hooks (useState, useEffect)
- Component-level state
- Props drilling prevention
- Isolated state for each tool
- Separate result messages per tab
- Clean state updates

### 🛡️ Error Handling & Validation

#### Frontend Validation
- Source selection validation before tool use
- Empty quiz submission warning
- File upload validation
- Form input validation
- Loading states for async operations
- User-friendly error messages

#### Backend Error Handling
- Try-catch blocks on all routes
- Detailed error logging
- Graceful failure modes
- Database connection error handling
- API key validation
- File upload error handling

### 🎨 UI/UX Features

#### Dark Theme Design
- Eye-strain reducing dark backgrounds
- High contrast text for readability
- Blue accent color (#0ea5e9)
- Consistent color scheme
- Professional appearance
- Custom scrollbar styling

#### Responsive Design
- Mobile-friendly layouts
- Flexible grid systems
- Breakpoint-based styling
- Touch-friendly buttons
- Responsive typography
- Adaptive navigation

#### Interactive Elements
- Hover effects on buttons and cards
- Smooth transitions (500ms)
- Loading spinners
- Progress indicators
- Visual feedback on all actions
- Animated card flips

#### Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Readable font sizes
- High contrast ratios

## 🛠 Tech Stack

### Frontend Technologies
- **React.js** (Create React App) - UI framework
- **Tailwind CSS 3.3.3** - Utility-first styling
- **PostCSS 8.4.31** & **Autoprefixer 10.4.16** - CSS processing
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.io Client** - Real-time communication
- **Custom hooks** - useEffect, useState for state management

### Backend Technologies
- **Node.js v24.6.0** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB** - NoSQL database (local: mongodb://localhost:27017/first-rank-raju)
- **Mongoose 8.0.0** - ODM for MongoDB
- **Socket.io 4.6.0** - WebSocket server
- **Multer 1.4.5-lts.1** - File upload handling
- **pdf-parse 1.1.1** - PDF text extraction
- **@google/generative-ai 0.1.3** - Gemini AI integration
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

### AI & External Services
- **Google Gemini API** (gemini-2.5-flash model)
- AI-powered chat responses
- Intelligent content generation
- Context-aware assistance

### Development Tools
- **nodemon** - Auto-reload during development
- **ESLint** - Code linting
- **Git** - Version control
- **npm** - Package management

## 📁 Project Structure

```
FirstRankRaju/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   ├── models/
│   │   ├── Source.js                # File storage schema with PDF content
│   │   ├── Quiz.js                  # Quiz schema with questions subdocuments
│   │   ├── Flashcard.js             # Flashcard schema with card sets
│   │   ├── Timeline.js              # Timeline schema with events
│   │   └── Chat.js                  # Chat history with session tracking
│   ├── routes/
│   │   ├── sources.js               # File upload, list, view, delete
│   │   ├── tools.js                 # Quiz, summary, flashcard, timeline
│   │   ├── chat.js                  # AI chat with multi-source context
│   │   └── performance.js           # Quiz statistics and history
│   ├── services/
│   │   └── geminiService.js         # Google Gemini AI integration
│   ├── .env                         # Environment variables (API keys)
│   ├── server.js                    # Express server with Socket.io
│   ├── update-pdf-content.js        # Script to extract PDF text
│   └── package.json                 # Backend dependencies
│
└── frontend/
    ├── public/
    │   └── index.html               # HTML template
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js            # Centered navigation bar
    │   │   └── UploadModal.js       # Drag-and-drop file upload
    │   ├── pages/
    │   │   ├── Dashboard.js         # Three-column workspace
    │   │   ├── Chat.js              # Multi-source AI chat
    │   │   ├── Tools.js             # Tabbed tools interface
    │   │   └── Performance.js       # Quiz history and analytics
    │   ├── App.js                   # Main app with routing
    │   ├── index.js                 # Entry point
    │   └── index.css                # Global styles with Tailwind
    ├── .env                         # API URL configuration
    ├── tailwind.config.js           # Tailwind customization
    ├── postcss.config.js            # PostCSS configuration
    └── package.json                 # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher, tested on v24.6.0)
- **MongoDB** (local installation or MongoDB Atlas)
- **Google Gemini API key** (Get from Google AI Studio)
- **npm** or **yarn** package manager

### Installation

#### 1. Clone or Navigate to Repository
```bash
cd /Users/mayurshadhidhar/Documents/FirstRankRaju
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

**Backend Dependencies Installed:**
- express@4.18.2
- mongoose@8.0.0
- socket.io@4.6.0
- multer@1.4.5-lts.1
- pdf-parse@1.1.1
- @google/generative-ai@0.1.3
- cors
- dotenv
- nodemon (dev dependency)

Create `.env` file in backend folder:
```env
MONGODB_URI=mongodb://localhost:27017/first-rank-raju
PORT=5001
NODE_ENV=development
GEMINI_API_KEY=AIzaSyDeCenVjXPDhKXEBwfKi_ItZ3gHB2GYjO0
FRONTEND_URL=http://localhost:3000
```

**Start MongoDB** (if using local installation):
```bash
mongod
```

**Start the backend server:**
```bash
npm run dev
```

Server will run on `http://localhost:5001`

Expected console output:
```
🚀 Server running on port 5001
✅ MongoDB Connected: localhost
📊 Database: first-rank-raju
🔌 Socket.io initialized
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

**Frontend Dependencies Installed:**
- react@18.x
- react-router-dom
- axios
- socket.io-client
- tailwindcss@3.3.3
- postcss@8.4.31
- autoprefixer@10.4.16

The `.env` file is already configured:
```env
REACT_APP_API_URL=http://localhost:5001
```

**Start the frontend:**
```bash
npm start
```

App will open automatically at `http://localhost:3000`

## 🧪 Testing the Application

### 1. Test Backend API
Open browser and visit: `http://localhost:5001`

**Expected response:**
```json
{
  "success": true,
  "message": "🎓 First Rank Raju Backend Server is running!",
  "timestamp": "2025-10-24T..."
}
```

### 2. Test Frontend
The React app should open automatically at `http://localhost:3000`

**You should see:**
- Dark-themed interface
- Centered navigation bar (Dashboard, Tools, Chat, Performance)
- Three-column dashboard layout:
  - Left: Sources sidebar with Upload button
  - Center: Content display area
  - Right: Tools sidebar with quick actions

### 3. Test MongoDB Connection
Check the backend terminal for connection confirmation:
```
✅ MongoDB Connected: localhost
📊 Database: first-rank-raju
```

**Verify in MongoDB:**
```bash
mongosh
use first-rank-raju
show collections
```

Expected collections: `sources`, `quizzes`, `chats`, `flashcards`, `timelines`

### 4. Test File Upload
1. Click **"Upload Source"** button in Dashboard
2. Drag and drop a PDF file or click to browse
3. Select subject category
4. Upload file
5. Verify PDF text extraction in source content viewer

### 5. Test AI Chat
1. Navigate to **Chat** page
2. Select one or more sources from left sidebar
3. Type a question related to your study materials
4. Verify AI response appears
5. Test multi-source context by selecting multiple PDFs

### 6. Test Quiz Creator
1. Go to **Tools** page
2. Select Quiz Creator tab
3. Choose a source from dropdown
4. Set number of questions (10-20 recommended)
5. Click "Generate Quiz"
6. Answer questions and submit
7. Verify scoring and detailed results
8. Check "View History" to see past quizzes

### 7. Test Other Tools
- **Summary**: Select source, choose length, generate summary
- **Flashcards**: Set card count, generate, flip cards
- **Timeline**: Generate chronological timeline from materials

### 8. Test Performance Dashboard
1. Navigate to **Performance** page
2. Verify quiz statistics display correctly
3. Check quiz history list
4. Verify scores and dates are accurate

## 📡 API Endpoints

### Source Management
- `GET /api/sources` - Get all uploaded sources
- `POST /api/sources/upload` - Upload new source with PDF text extraction
- `GET /api/sources/:id` - Get specific source details with content
- `DELETE /api/sources/:id` - Delete a source

### Study Tools
- `POST /api/tools/summary` - Generate AI summary (params: sourceId, length)
- `POST /api/tools/quiz/generate` - Create quiz (params: sourceId, numQuestions)
- `POST /api/tools/quiz/:id/submit` - Submit quiz answers (params: answers array)
- `GET /api/tools/quiz/history` - Get all completed quizzes
- `GET /api/tools/quiz/:id/review` - Get detailed quiz review
- `POST /api/tools/flashcard` - Create flashcards (params: sourceId, numCards)
- `POST /api/tools/timeline` - Create timeline (params: sourceId)

### AI Chat
- `POST /api/chat` - Send message to AI (params: message, sessionId, sourceIds[])
- `GET /api/chat/history/:sessionId` - Get chat history for session
- Socket event: `chat-message` - Real-time message broadcasting

### Performance Tracking
- `GET /api/performance` - Get performance statistics and quiz history
- `GET /api/performance/quiz/:id` - Get specific quiz performance data

### Request/Response Format

**Successful Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🎨 Design System

### Color Palette
- **Background**: `#0f0f0f` (dark-100), `#1a1a1a` (dark-200)
- **Borders**: `#2d2d2d` (dark-300)
- **Text Primary**: `#ffffff` (white), `#f0f0f0` (gray-100)
- **Text Secondary**: `#9ca3af` (gray-400), `#6b7280` (gray-500)
- **Accent Blue**: `#0ea5e9` (blue-600), `#3b82f6` (blue-500)
- **Success Green**: `#10b981` (green-400)
- **Error Red**: `#ef4444` (red-400)

### Typography
- **Headings**: Bold, white text with proper hierarchy
- **Body**: Gray-100 for primary content, Gray-400 for secondary
- **Code/Mono**: Font-mono for code blocks and file content

### Layout Principles
- **Three-column dashboard** for optimal workflow
- **Sidebar widths**: 256px (sources), 320px (tools)
- **Responsive breakpoints**: Mobile, tablet, desktop
- **Spacing**: Consistent padding (p-4, p-6, p-8)
- **Rounded corners**: 8px (rounded-lg) for cards and inputs

### Component Styling
- **Cards**: `bg-gray-800` with `border-gray-700`
- **Buttons**: Blue gradient on hover, disabled states
- **Inputs**: Dark background with blue focus ring
- **Modals**: Centered overlay with backdrop blur
- **Navigation**: Centered with blue underline for active route

### Interactive States
- **Hover**: Brightness increase, background change
- **Active**: Blue accent color, border highlight
- **Loading**: Spin animation, pulsing effects
- **Disabled**: Reduced opacity, cursor not-allowed

### Animations
- **Transitions**: 500ms cubic-bezier for smooth motion
- **Flip cards**: 3D rotation with perspective
- **Fade in/out**: Opacity transitions for modals
- **Skeleton loading**: Pulse animation while fetching data

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/first-rank-raju

# Server
PORT=5001
NODE_ENV=development

# AI Service
GEMINI_API_KEY=your_actual_api_key_here

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5001
```

## 🗃️ Database Schema

### Source Model
```javascript
{
  filename: String,
  subject: String,
  fileType: String,
  fileSize: Number,
  fileData: Buffer,
  content: String,  // Extracted text from PDF
  uploadedAt: Date
}
```

### Quiz Model
```javascript
{
  title: String,
  subject: String,
  questions: [{
    _id: ObjectId,
    question: String,
    options: [String],
    correctAnswer: String,
    selectedAnswer: String,
    explanation: String
  }],
  score: Number,
  percentage: Number,
  isCompleted: Boolean,
  completedAt: Date
}
```

### Chat Model
```javascript
{
  sessionId: String,
  subject: String,
  messages: [{
    role: String,  // 'user' or 'assistant'
    content: String,
    timestamp: Date
  }],
  createdAt: Date
}
```

### Flashcard Model
```javascript
{
  title: String,
  subject: String,
  cards: [{
    front: String,
    back: String
  }],
  createdAt: Date
}
```

### Timeline Model
```javascript
{
  title: String,
  subject: String,
  events: [{
    date: String,
    title: String,
    description: String
  }],
  createdAt: Date
}
```

## � Application Workflow

### 1. Upload Study Materials
```
User clicks "Upload Source" 
  → Drag-and-drop or browse for PDF
  → Select subject category
  → Backend receives file via Multer
  → pdf-parse extracts text content
  → Store in MongoDB with metadata
  → Display in sources list
```

### 2. AI Chat with Context
```
User navigates to Chat page
  → Select multiple sources from sidebar
  → Sources highlighted with checkmarks
  → Type message in input field
  → Frontend sends: message + sessionId + sourceIds[]
  → Backend fetches all selected sources
  → Combines content with separators
  → Sends to Gemini AI with context
  → AI response streamed back
  → Display in chat with timestamp
  → Socket.io broadcasts to all clients
```

### 3. Quiz Generation & Submission
```
User goes to Tools → Quiz Creator
  → Select source from dropdown
  → Choose number of questions
  → Click "Generate Quiz"
  → Backend sends content to Gemini AI
  → AI generates MCQ questions with explanations
  → Questions stored in MongoDB with _id
  → User answers questions
  → Click "Submit Quiz"
  → Backend receives answers array
  → Pre-save hook calculates score
  → Results displayed with review
  → Quiz saved to history
```

### 4. Performance Tracking
```
User navigates to Performance page
  → Backend queries all completed quizzes
  → Calculate statistics (avg, highest, lowest)
  → Display stat cards
  → List quiz history with scores
  → Click quiz to review details
```

## 🚨 Known Issues & Solutions

### Issue: PDF not extracting text
**Solution**: Ensure pdf-parse v1.1.1 is installed (not v2.x). Run extraction script:
```bash
cd backend
node update-pdf-content.js
```

### Issue: Gemini API quota exceeded
**Solution**: Check API key limits in Google AI Studio. Consider implementing rate limiting.

### Issue: Quiz submission not calculating score
**Solution**: Ensure questions have `_id` field. Pre-save hook requires ObjectId matching.

### Issue: Messages appearing in wrong tool tabs
**Solution**: Fixed by using separate result states (quizResult, summaryResult, etc.)

### Issue: Lowest score showing 100% when no quizzes
**Solution**: Fixed by initializing lowestScore to 0 instead of 100

### Issue: Socket.io connection errors
**Solution**: Verify CORS settings and frontend URL in backend .env

## 📚 Key Implementation Details

### PDF Text Extraction
```javascript
const pdfParse = require('pdf-parse');
const buffer = req.file.buffer;
const data = await pdfParse(buffer);
const extractedText = data.text;
```

### Multi-Source Chat Context
```javascript
const sources = await Source.find({ _id: { $in: sourceIds } });
const context = sources.map((source, index) => {
  return `--- Source ${index + 1}: ${source.filename} ---\n${source.content}`;
}).join('\n\n');
```

### Quiz Scoring (Pre-Save Hook)
```javascript
quizSchema.pre('save', function(next) {
  if (this.isCompleted) {
    let correct = 0;
    this.questions.forEach(q => {
      if (q.selectedAnswer === q.correctAnswer) correct++;
    });
    this.score = correct;
    this.percentage = Math.round((correct / this.questions.length) * 100);
  }
  next();
});
```

### Tab-Specific Result Messages
```javascript
// Separate state for each tool
const [quizResult, setQuizResult] = useState(null);
const [summaryResult, setSummaryResult] = useState(null);
const [flashcardResult, setFlashcardResult] = useState(null);
const [timelineResult, setTimelineResult] = useState(null);
```

## 🎯 Future Enhancements

### Planned Features
- [ ] User authentication (JWT-based)
- [ ] Study schedules and reminders
- [ ] Collaborative study rooms
- [ ] Voice notes and transcription
- [ ] Mobile app (React Native)
- [ ] Export functionality (PDF, CSV)
- [ ] Spaced repetition algorithm
- [ ] Progress charts and graphs
- [ ] Dark/Light theme toggle
- [ ] Offline mode support

### Technical Improvements
- [ ] Redis caching for API responses
- [ ] Rate limiting for AI requests
- [ ] File compression for storage
- [ ] CDN integration for assets
- [ ] Progressive Web App (PWA)
- [ ] E2E testing with Cypress
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] TypeScript migration
- [ ] GraphQL API option

## 🤝 Contributing

This is a student project built as a comprehensive study platform. Contributions are welcome!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code structure and naming conventions
- Use meaningful commit messages
- Test all features before submitting PR
- Update README if adding new features
- Maintain dark theme consistency

## 📄 License

MIT License - feel free to use this project for learning and personal use.

## 🙏 Acknowledgments

### Technologies & Libraries
- **Google Gemini AI** - Powering intelligent chat and content generation
- **MongoDB** - Flexible NoSQL database for all data storage
- **Socket.io** - Enabling real-time communication
- **React** - Building responsive and interactive UI
- **Tailwind CSS** - Utility-first styling framework
- **pdf-parse** - Extracting text from PDF documents
- **Express.js** - Robust backend framework

### Inspiration
- Built for students struggling with information overload
- Designed to make studying more efficient and engaging
- Inspired by the need for AI-assisted learning tools

### Special Thanks
- Google AI Studio for Gemini API access
- MongoDB community for excellent documentation
- Open source community for amazing tools

## 📊 Project Statistics

- **Total Files**: 20+ source files
- **Lines of Code**: 5000+ lines
- **Components**: 8 React components
- **API Endpoints**: 15+ routes
- **Database Collections**: 5 schemas
- **Features Implemented**: 25+ distinct features
- **Development Time**: Iterative development with continuous improvements

## 📞 Support & Contact

For questions, issues, or suggestions:
- Create an issue in the repository
- Review existing documentation
- Check API error messages for troubleshooting

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ Full-stack MERN development
- ✅ RESTful API design
- ✅ MongoDB schema modeling
- ✅ Real-time WebSocket communication
- ✅ AI API integration (Google Gemini)
- ✅ File upload and processing
- ✅ PDF text extraction
- ✅ State management in React
- ✅ Responsive UI design
- ✅ Error handling and validation
- ✅ Component-based architecture
- ✅ Database queries and aggregations

---

**Built with ❤️ for students, by students**

*"First Rank Raju - Your AI-powered study companion"*

---

### Quick Start Commands

```bash
# Start MongoDB
mongod

# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

# Visit application
open http://localhost:3000
```

### Project Status
✅ **Fully Functional** - All features working as expected
- File upload with PDF extraction ✓
- Multi-source AI chat ✓
- Quiz generation and history ✓
- Summary, Flashcards, Timeline tools ✓
- Performance tracking ✓
- Real-time updates ✓

Last Updated: October 24, 2025
