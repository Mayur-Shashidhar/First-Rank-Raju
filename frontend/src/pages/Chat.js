import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const messagesEndRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    console.log('Chat component mounted, connecting to:', API_URL);
    
    // Initialize Socket.io connection
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Socket.io connected!');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
    });

    // Listen for real-time messages
    newSocket.on('chat-message', (data) => {
      console.log('Received chat message:', data);
      if (data.sessionId === sessionId) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    // Fetch sources for context
    fetchSources();

    // Load initial welcome message
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI study assistant powered by Gemini. How can I help you today? 📚\n\nYou can:\n• Ask questions about your study materials\n• Request summaries or explanations\n• Get help with concepts\n• Generate quizzes and flashcards',
        timestamp: new Date()
      }
    ]);

    return () => {
      console.log('Disconnecting socket...');
      newSocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL]);

  const fetchSources = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sources`);
      if (response.data.success) {
        setSources(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    console.log('Sending message to API:', {
      message: inputMessage,
      sessionId: sessionId,
      sourceIds: selectedSources.map(s => s._id)
    });

    try {
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: inputMessage,
        sessionId: sessionId,
        sourceIds: selectedSources.map(s => s._id)
      });

      console.log('API Response:', response.data);

      if (response.data.success) {
        // Set session ID if this is the first message
        if (!sessionId) {
          setSessionId(response.data.sessionId);
          console.log('Session ID set:', response.data.sessionId);
        }

        const aiMessage = {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(response.data.timestamp)
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        console.error('API returned success:false', response.data);
        throw new Error(response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = {
        role: 'assistant',
        content: `❌ Error: ${error.response?.data?.message || error.message}\n\nPlease check:\n1. Backend server is running on port 5001\n2. Gemini API key is configured in backend/.env\n3. MongoDB is running`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSourceSelect = (source) => {
    const isSelected = selectedSources.some(s => s._id === source._id);
    
    if (isSelected) {
      // Remove source
      const newSources = selectedSources.filter(s => s._id !== source._id);
      setSelectedSources(newSources);
      
      const contextMessage = {
        role: 'assistant',
        content: `📖 Removed "${source.filename}" from context.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, contextMessage]);
    } else {
      // Add source
      const newSources = [...selectedSources, source];
      setSelectedSources(newSources);
      
      const contextMessage = {
        role: 'assistant',
        content: `📖 Added "${source.filename}" (${source.subject}) to context. I can now answer questions from ${newSources.length} source${newSources.length > 1 ? 's' : ''}.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, contextMessage]);
    }
  };

  return (
    <div className="flex-1 flex h-screen bg-dark-100">
      {/* Left Sidebar - Source Selection */}
      <div className="w-64 bg-dark-200 border-r border-dark-300 flex flex-col">
        <div className="p-4 border-b border-dark-300">
          <h3 className="text-white font-semibold mb-2">Study Materials</h3>
          <p className="text-xs text-gray-400">Select multiple for context</p>
          {selectedSources.length > 0 && (
            <p className="text-xs text-blue-400 mt-1">
              {selectedSources.length} selected
            </p>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-3">
          {sources.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-8">No sources uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {sources.map((source) => {
                const isSelected = selectedSources.some(s => s._id === source._id);
                return (
                  <div
                    key={source._id}
                    onClick={() => handleSourceSelect(source)}
                    className={`p-3 rounded cursor-pointer transition-colors relative ${
                      isSelected
                        ? 'bg-blue-600'
                        : 'bg-dark-300 hover:bg-dark-400'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <p className="text-white text-sm font-medium truncate pr-6">{source.filename}</p>
                    <p className="text-gray-400 text-xs mt-1">{source.subject}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedSources.length > 0 && (
          <div className="p-3 border-t border-dark-300 bg-dark-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">Active contexts:</p>
              <button
                onClick={() => {
                  setSelectedSources([]);
                  const contextMessage = {
                    role: 'assistant',
                    content: '📖 Cleared all source contexts.',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, contextMessage]);
                }}
                className="text-xs text-red-500 hover:text-red-400"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {selectedSources.map((source) => (
                <div key={source._id} className="flex items-center justify-between text-xs">
                  <p className="text-white truncate flex-1">{source.filename}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSourceSelect(source);
                    }}
                    className="text-red-500 hover:text-red-400 ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-dark-300 bg-dark-200">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            AI Study Assistant
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Powered by Google Gemini {selectedSources.length > 0 && `• Context: ${selectedSources.length} source${selectedSources.length > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-dark-100">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-200 text-gray-100 border border-dark-300'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400">AI Assistant</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <p className="text-xs mt-2 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-dark-200 border border-dark-300 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-gray-400 text-sm ml-2">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-dark-300 bg-dark-200">
          <form onSubmit={sendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your studies..."
              className="flex-1 bg-dark-300 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
            >
              {loading ? (
                <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI can make mistakes. Check important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
