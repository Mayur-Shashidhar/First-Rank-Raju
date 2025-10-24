# First Rank Raju - Backend

Backend server for the First Rank Raju student productivity platform.

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.io
- **AI:** Google Gemini API

## 📁 Project Structure
```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── Source.js          # File upload schema
│   ├── Quiz.js            # Quiz schema
│   ├── Flashcard.js       # Flashcard schema
│   ├── Timeline.js        # Timeline schema
│   └── Chat.js            # Chat history schema
├── routes/
│   ├── sources.js         # File management routes
│   ├── tools.js           # Study tools routes
│   ├── chat.js            # AI chat routes
│   └── performance.js     # Performance tracking routes
├── .env                   # Environment variables
├── .env.example           # Example environment variables
├── package.json           # Dependencies
└── server.js              # Main server file
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend folder with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Server

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📡 API Endpoints

### Health Check
- `GET /` - Server status

### Sources (File Management)
- `GET /api/sources` - Get all sources
- `POST /api/sources/upload` - Upload new source

### Study Tools
- `POST /api/tools/summary` - Generate summary
- `POST /api/tools/quiz` - Generate quiz
- `POST /api/tools/flashcard` - Create flashcards
- `POST /api/tools/timeline` - Create timeline

### AI Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat/history` - Get chat history

### Performance
- `GET /api/performance` - Get performance data
- `POST /api/performance/quiz` - Save quiz score

## 🔌 Socket.io Events
Real-time communication for:
- Instant chat updates
- Notification system
- Live collaboration features

## 📊 Database Models

### Source
- filename, subject, content, fileData
- Upload date, tags, summary

### Quiz
- title, subject, questions, score
- Completion status, timestamps

### Flashcard
- title, subject, cards (front/back)
- Mastered status

### Timeline
- title, subject, events
- Chronological ordering

### Chat
- sessionId, messages (user/assistant)
- Subject, last activity

## 🧪 Testing
Server should run on `http://localhost:5000`

Test health endpoint:
```bash
curl http://localhost:5000
```

Expected response:
```json
{
  "success": true,
  "message": "🎓 First Rank Raju Backend Server is running!",
  "timestamp": "2025-10-24T..."
}
```

## 📝 Notes
- All file data is stored directly in MongoDB
- Socket.io configured for real-time features
- CORS enabled for frontend communication
- Routes ready for implementation
