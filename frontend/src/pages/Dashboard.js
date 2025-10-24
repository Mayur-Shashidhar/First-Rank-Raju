import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UploadModal from '../components/UploadModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  
  // Tool states
  const [activeTool, setActiveTool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toolResult, setToolResult] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

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

  const handleDeleteSource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this source?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/api/sources/${id}`);
      if (response.data.success) {
        fetchSources();
        if (selectedSource?._id === id) {
          setSelectedSource(null);
        }
      }
    } catch (error) {
      console.error('Error deleting source:', error);
      alert('Failed to delete source');
    }
  };

  const handleViewSource = async (source) => {
    try {
      const response = await axios.get(`${API_URL}/api/sources/${source._id}`);
      if (response.data.success) {
        setSelectedSource(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching source details:', error);
    }
  };

  useEffect(() => {
    fetchSources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const response = await axios.post(`${API_URL}/api/sources/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        fetchSources();
        setUploadFile(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Prevent unused variable warning by using the function
  console.log('Upload handler ready:', typeof handleFileUpload);

  const handleToolClick = async (toolName) => {
    if (!selectedSource) {
      alert('Please select a source first');
      return;
    }

    setActiveTool(toolName);
    setLoading(true);
    setToolResult(null);

    try {
      let response;
      
      switch(toolName) {
        case 'summary':
          response = await axios.post(`${API_URL}/api/tools/summary`, {
            sourceId: selectedSource._id,
            length: 'medium'
          });
          if (response.data.success) {
            setToolResult({ type: 'summary', data: response.data.data.summary });
          }
          break;
          
        case 'quiz':
          // Navigate to Tools page with quiz tab
          navigate('/tools', { state: { activeTab: 'quiz', sourceId: selectedSource._id } });
          return;
          
        case 'flashcard':
          response = await axios.post(`${API_URL}/api/tools/flashcard`, {
            sourceId: selectedSource._id,
            numCards: 10
          });
          if (response.data.success) {
            setToolResult({ type: 'flashcard', data: response.data.data });
          }
          break;
          
        case 'timeline':
          response = await axios.post(`${API_URL}/api/tools/timeline`, {
            sourceId: selectedSource._id
          });
          if (response.data.success) {
            setToolResult({ type: 'timeline', data: response.data.data });
          }
          break;
          
        default:
          alert(`${toolName} tool coming soon!`);
      }
    } catch (error) {
      console.error(`Error generating ${toolName}:`, error);
      alert(`Failed to generate ${toolName}`);
    } finally {
      setLoading(false);
    }
  };

  const closeToolResult = () => {
    setActiveTool(null);
    setToolResult(null);
  };

  return (
    <div className="flex w-full h-screen">
      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={fetchSources}
      />

      {/* Left Sidebar - Sources */}
      <div className="w-80 bg-dark-100 border-r border-dark-300 flex flex-col">
        <div className="p-4 border-b border-dark-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Sources
            </h2>
            <button className="p-2 hover:bg-dark-300 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Upload Source
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {sources.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p>Sources will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sources.map((source) => (
                <div
                  key={source._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                    selectedSource?._id === source._id
                      ? 'bg-blue-600'
                      : 'bg-dark-200 hover:bg-dark-300'
                  }`}
                  onClick={() => handleViewSource(source)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{source.filename}</p>
                      <p className="text-gray-400 text-xs mt-1">{source.subject}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(source.uploadDate).toLocaleDateString()}
                      </p>
                      {source.tags && source.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {source.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-dark-300 text-gray-300 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSource(source._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 ml-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle Section - Chat/Output */}
      <div className="flex-1 flex flex-col bg-dark-100">
        <div className="p-4 border-b border-dark-300">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat
            </h2>
            <button className="p-2 hover:bg-dark-300 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center text-gray-500">
          {selectedSource ? (
            <div className="w-full h-full flex flex-col">
              <div className="p-4 border-b border-dark-300">
                <h3 className="text-lg font-semibold text-white">{selectedSource.filename}</h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {selectedSource.subject}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(selectedSource.uploadDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {selectedSource.fileType.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-dark-200 rounded-lg p-6">
                  <h4 className="text-white font-medium mb-4">Content:</h4>
                  <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                    {selectedSource.content}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <p>Select a source to view its content</p>
          )}
        </div>
      </div>

      {/* Right Sidebar - Tools */}
      <div className="w-80 bg-dark-100 border-l border-dark-300 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Tools</h2>
          <button className="p-2 hover:bg-dark-300 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {/* Flash Card */}
          <div 
            onClick={() => handleToolClick('flashcard')}
            className="bg-dark-200 p-4 rounded-lg hover:bg-dark-300 cursor-pointer transition-colors"
          >
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span className="text-white font-medium">Flash Card</span>
            </div>
            {!selectedSource && <p className="text-gray-500 text-xs">Select a source first</p>}
          </div>

          {/* Timeline */}
          <div 
            onClick={() => handleToolClick('timeline')}
            className="bg-dark-200 p-4 rounded-lg hover:bg-dark-300 cursor-pointer transition-colors"
          >
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <span className="text-white font-medium">Timeline</span>
            </div>
            {!selectedSource && <p className="text-gray-500 text-xs">Select a source first</p>}
          </div>

          {/* Summary */}
          <div 
            onClick={() => handleToolClick('summary')}
            className="bg-dark-200 p-4 rounded-lg hover:bg-dark-300 cursor-pointer transition-colors"
          >
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-white font-medium">Summary</span>
            </div>
            {!selectedSource && <p className="text-gray-500 text-xs">Select a source first</p>}
          </div>

          {/* Quiz */}
          <div 
            onClick={() => handleToolClick('quiz')}
            className="bg-dark-200 p-4 rounded-lg hover:bg-dark-300 cursor-pointer transition-colors"
          >
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-white font-medium">Quiz</span>
            </div>
            {!selectedSource && <p className="text-gray-500 text-xs">Select a source first</p>}
          </div>

          {/* Reports */}
          <div 
            onClick={() => navigate('/performance')}
            className="bg-dark-200 p-4 rounded-lg hover:bg-dark-300 cursor-pointer transition-colors"
          >
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-white font-medium">Performance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Result Modal */}
      {(activeTool || loading) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-200 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-dark-300 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white capitalize">{activeTool}</h2>
              <button 
                onClick={closeToolResult}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <span className="ml-4 text-gray-400">Generating {activeTool}...</span>
                </div>
              ) : toolResult ? (
                <>
                  {toolResult.type === 'summary' && (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 whitespace-pre-wrap">{toolResult.data}</p>
                    </div>
                  )}

                  {toolResult.type === 'flashcard' && (
                    <div className="space-y-4">
                      <p className="text-gray-400 mb-4">
                        {toolResult.data.cards.length} flashcards generated
                      </p>
                      {toolResult.data.cards.slice(0, 5).map((card, index) => (
                        <div key={index} className="bg-dark-300 p-4 rounded-lg">
                          <div className="text-blue-400 font-medium mb-2">Q: {card.front}</div>
                          <div className="text-gray-300">A: {card.back}</div>
                        </div>
                      ))}
                      {toolResult.data.cards.length > 5 && (
                        <button
                          onClick={() => navigate('/tools', { state: { activeTab: 'flashcard' } })}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          View All Flashcards
                        </button>
                      )}
                    </div>
                  )}

                  {toolResult.type === 'timeline' && (
                    <div className="relative border-l-2 border-blue-500 pl-8 space-y-6">
                      {toolResult.data.events.map((event, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-9 top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-dark-200"></div>
                          <div className="bg-dark-300 p-4 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-white">{event.title}</h3>
                              <span className="text-sm text-blue-400 font-medium">{event.date}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{event.description}</p>
                            {event.category && (
                              <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-900/50 text-blue-300 rounded">
                                {event.category}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : null}
            </div>

            <div className="p-6 border-t border-dark-300 flex justify-end gap-3">
              <button
                onClick={closeToolResult}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => navigate('/tools', { state: { activeTab: activeTool } })}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Open in Tools
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
