import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tools = () => {
  const [activeTab, setActiveTab] = useState('quiz');
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Quiz specific states
  const [numQuestions, setNumQuestions] = useState(10);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [reviewQuiz, setReviewQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  // Summary specific states
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summary, setSummary] = useState(null);
  const [summaryResult, setSummaryResult] = useState(null);

  // Flashcard specific states
  const [numCards, setNumCards] = useState(15);
  const [flashcards, setFlashcards] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardResult, setFlashcardResult] = useState(null);

  // Timeline specific states
  const [timeline, setTimeline] = useState(null);
  const [timelineResult, setTimelineResult] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchSources();
    if (activeTab === 'quiz') {
      fetchQuizHistory();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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

  const fetchQuizHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tools/quiz/history`);
      if (response.data.success) {
        setQuizHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    }
  };

  const handleViewQuizReview = async (quizId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/tools/quiz/${quizId}/review`);
      if (response.data.success) {
        setReviewQuiz(response.data.data);
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Error fetching quiz review:', error);
      alert('Failed to load quiz review');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedSource) {
      alert('Please select a source first');
      return;
    }

    setLoading(true);
    setQuizResult(null);
    setQuizData(null);
    setQuizResults(null);
    setAnswers({});
    setCurrentQuestion(0);

    try {
      const response = await axios.post(`${API_URL}/api/tools/quiz/generate`, {
        sourceId: selectedSource._id,
        numQuestions: numQuestions
      });

      if (response.data.success) {
        setQuizData(response.data.data);
        setQuizResult({ type: 'success', message: 'Quiz generated! Start answering below.' });
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      setQuizResult({ type: 'error', message: error.response?.data?.message || 'Failed to generate quiz' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quizData || !quizData.questions) {
      alert('Quiz data is invalid');
      return;
    }

    if (Object.keys(answers).length < quizData.questions.length) {
      if (!window.confirm('You haven\'t answered all questions. Submit anyway?')) {
        return;
      }
    }

    setLoading(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      const response = await axios.post(`${API_URL}/api/tools/quiz/${quizData.quizId}/submit`, {
        answers: formattedAnswers
      });

      if (response.data.success) {
        setQuizResults(response.data.data);
        setQuizResult({ type: 'success', message: `Quiz completed! Score: ${response.data.data.percentage}%` });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setQuizResult({ type: 'error', message: 'Failed to submit quiz' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!selectedSource) {
      alert('Please select a source first');
      return;
    }

    setLoading(true);
    setSummaryResult(null);
    setSummary(null);

    try {
      const response = await axios.post(`${API_URL}/api/tools/summary`, {
        sourceId: selectedSource._id,
        length: summaryLength
      });

      if (response.data.success) {
        setSummary(response.data.data.summary);
        setSummaryResult({ type: 'success', message: 'Summary generated successfully!' });
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaryResult({ type: 'error', message: error.response?.data?.message || 'Failed to generate summary' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!selectedSource) {
      alert('Please select a source first');
      return;
    }

    setLoading(true);
    setFlashcardResult(null);
    setFlashcards(null);
    setCurrentCard(0);
    setIsFlipped(false);

    try {
      const response = await axios.post(`${API_URL}/api/tools/flashcard`, {
        sourceId: selectedSource._id,
        numCards: numCards
      });

      if (response.data.success) {
        setFlashcards(response.data.data);
        setFlashcardResult({ type: 'success', message: 'Flashcards generated successfully!' });
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setFlashcardResult({ type: 'error', message: error.response?.data?.message || 'Failed to generate flashcards' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTimeline = async () => {
    if (!selectedSource) {
      alert('Please select a source first');
      return;
    }

    setLoading(true);
    setTimelineResult(null);
    setTimeline(null);

    try {
      const response = await axios.post(`${API_URL}/api/tools/timeline`, {
        sourceId: selectedSource._id
      });

      if (response.data.success) {
        setTimeline(response.data.data);
        setTimelineResult({ type: 'success', message: 'Timeline generated successfully!' });
      }
    } catch (error) {
      console.error('Error generating timeline:', error);
      setTimelineResult({ type: 'error', message: error.response?.data?.message || 'Failed to generate timeline' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Study Tools</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-8 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'quiz'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Quiz Creator
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'summary'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('flashcard')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'flashcard'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Flashcards
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'timeline'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Timeline
        </button>
      </div>

      {/* Source Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Study Material
        </label>
        <select
          value={selectedSource?._id || ''}
          onChange={(e) => setSelectedSource(sources.find(s => s._id === e.target.value))}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a source...</option>
          {sources && sources.length > 0 ? (
            sources.map((source) => (
              <option key={source._id} value={source._id}>
                {source.filename} - {source.subject}
              </option>
            ))
          ) : (
            <option value="" disabled>No sources available</option>
          )}
        </select>
      </div>

      {/* Quiz Creator Tab */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Quiz Result Message */}
          {quizResult && (
            <div className={`mb-6 p-4 rounded-lg ${
              quizResult.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-red-900/30 text-red-400 border border-red-700'
            }`}>
              {quizResult.message}
            </div>
          )}
          
          {/* History Toggle Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setShowHistory(!showHistory);
                if (!showHistory) {
                  fetchQuizHistory();
                  setQuizData(null);
                  setQuizResults(null);
                  setReviewQuiz(null);
                }
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showHistory ? 'Create New Quiz' : 'View History'}
            </button>
          </div>

          {/* Quiz History */}
          {showHistory && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Quiz History</h2>
              {quizHistory.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No quiz history yet. Take a quiz to see it here!</p>
              ) : (
                <div className="space-y-3">
                  {quizHistory.map((quiz) => (
                    <div
                      key={quiz._id}
                      onClick={() => handleViewQuizReview(quiz._id)}
                      className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="text-gray-100 font-medium mb-1">{quiz.title}</h3>
                        <p className="text-gray-400 text-sm">{quiz.subject}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(quiz.completedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-2xl font-bold ${
                          quiz.percentage >= 80 ? 'text-green-400' :
                          quiz.percentage >= 60 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {quiz.percentage}%
                        </p>
                        <p className="text-gray-400 text-sm">{quiz.score}/{quiz.totalQuestions}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Review Quiz */}
          {reviewQuiz && !showHistory && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-100">Quiz Review: {reviewQuiz.title}</h2>
                <button
                  onClick={() => {
                    setReviewQuiz(null);
                    setShowHistory(true);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Score Card */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-900/30 p-4 rounded-lg text-center border border-blue-700">
                  <p className="text-sm text-gray-400 mb-1">Score</p>
                  <p className="text-3xl font-bold text-blue-400">{reviewQuiz.percentage}%</p>
                </div>
                <div className="bg-green-900/30 p-4 rounded-lg text-center border border-green-700">
                  <p className="text-sm text-gray-400 mb-1">Correct</p>
                  <p className="text-3xl font-bold text-green-400">{reviewQuiz.score}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                  <p className="text-sm text-gray-400 mb-1">Total</p>
                  <p className="text-3xl font-bold text-gray-300">{reviewQuiz.totalQuestions}</p>
                </div>
              </div>

              {/* Questions Review */}
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Review Answers</h3>
              <div className="space-y-4">
                {reviewQuiz.questions.map((q, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      q.isCorrect
                        ? 'bg-green-900/20 border-green-700'
                        : 'bg-red-900/20 border-red-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-100">{index + 1}. {q.question}</p>
                      <span className={`px-2 py-1 rounded text-sm ${
                        q.isCorrect
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {q.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Your answer: <span className={q.isCorrect ? 'text-green-400' : 'text-red-400'}>{q.selectedAnswer || 'Not answered'}</span></p>
                    {!q.isCorrect && (
                      <p className="text-sm text-gray-400 mb-1">Correct answer: <span className="text-green-400">{q.correctAnswer}</span></p>
                    )}
                    {q.explanation && (
                      <p className="text-sm text-gray-300 mt-2 italic">{q.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!quizData && !quizResults && !showHistory && !reviewQuiz && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Generate Quiz</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-32 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100"
                />
              </div>
              <button
                onClick={handleGenerateQuiz}
                disabled={loading || !selectedSource}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </div>
          )}

          {quizData && !quizResults && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">{quizData.title}</h2>
                <span className="text-sm text-gray-400">
                  Question {currentQuestion + 1} of {quizData.questions?.length || 0}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${quizData.questions?.length ? ((currentQuestion + 1) / quizData.questions.length) * 100 : 0}%` }}
                ></div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-100 mb-4">
                  {quizData.questions && quizData.questions[currentQuestion]?.question}
                </h3>
                <div className="space-y-3">
                  {quizData.questions && quizData.questions[currentQuestion]?.options?.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        answers[quizData.questions[currentQuestion]._id] === option
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        checked={answers[quizData.questions[currentQuestion]._id] === option}
                        onChange={() => setAnswers({
                          ...answers,
                          [quizData.questions[currentQuestion]._id]: option
                        })}
                        className="mr-3"
                      />
                      <span className="text-gray-200">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {quizData.questions && currentQuestion < quizData.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion(Math.min(quizData.questions.length - 1, currentQuestion + 1))}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600"
                  >
                    {loading ? 'Submitting...' : 'Submit Quiz'}
                  </button>
                )}
              </div>

              {/* Answer Summary */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Answered: {Object.keys(answers).length} / {quizData.questions?.length || 0}</p>
                <div className="flex flex-wrap gap-2">
                  {quizData.questions && quizData.questions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-10 h-10 rounded-lg font-medium ${
                        answers[q._id]
                          ? 'bg-green-600 text-white'
                          : currentQuestion === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {quizResults && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-100">Quiz Results</h2>
              
              {/* Score Card */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-900/30 p-4 rounded-lg text-center border border-blue-700">
                  <p className="text-sm text-gray-400 mb-1">Score</p>
                  <p className="text-3xl font-bold text-blue-400">{quizResults.percentage}%</p>
                </div>
                <div className="bg-green-900/30 p-4 rounded-lg text-center border border-green-700">
                  <p className="text-sm text-gray-400 mb-1">Correct</p>
                  <p className="text-3xl font-bold text-green-400">{quizResults.score}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600">
                  <p className="text-sm text-gray-400 mb-1">Total</p>
                  <p className="text-3xl font-bold text-gray-300">{quizResults.totalQuestions}</p>
                </div>
              </div>

              {/* Question Review */}
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Review Answers</h3>
              <div className="space-y-4">
                {quizResults.questions && quizResults.questions.map((q, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      q.selectedAnswer === q.correctAnswer
                        ? 'bg-green-900/20 border-green-700'
                        : 'bg-red-900/20 border-red-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-100">{index + 1}. {q.question}</p>
                      <span className={`px-2 py-1 rounded text-sm ${
                        q.selectedAnswer === q.correctAnswer
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {q.selectedAnswer === q.correctAnswer ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-1">Your answer: <span className={q.selectedAnswer === q.correctAnswer ? 'text-green-400' : 'text-red-400'}>{q.selectedAnswer || 'Not answered'}</span></p>
                    {q.selectedAnswer !== q.correctAnswer && (
                      <p className="text-sm text-gray-400 mb-1">Correct answer: <span className="text-green-400">{q.correctAnswer}</span></p>
                    )}
                    {q.explanation && (
                      <p className="text-sm text-gray-300 mt-2 italic">{q.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setQuizResults(null);
                  setQuizData(null);
                  setAnswers({});
                  setCurrentQuestion(0);
                  fetchQuizHistory(); // Refresh history
                }}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Summary Result Message */}
          {summaryResult && (
            <div className={`mb-6 p-4 rounded-lg ${
              summaryResult.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-red-900/30 text-red-400 border border-red-700'
            }`}>
              {summaryResult.message}
            </div>
          )}
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Generate Summary</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Summary Length
              </label>
              <select
                value={summaryLength}
                onChange={(e) => setSummaryLength(e.target.value)}
                className="w-48 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100"
              >
                <option value="short">Short (2-3 paragraphs)</option>
                <option value="medium">Medium (5-7 paragraphs)</option>
                <option value="long">Long (Comprehensive)</option>
              </select>
            </div>
            <button
              onClick={handleGenerateSummary}
              disabled={loading || !selectedSource}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Summary'}
            </button>
          </div>

          {summary && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Summary</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Flashcard Tab */}
      {activeTab === 'flashcard' && (
        <div className="space-y-6">
          {/* Flashcard Result Message */}
          {flashcardResult && (
            <div className={`mb-6 p-4 rounded-lg ${
              flashcardResult.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-red-900/30 text-red-400 border border-red-700'
            }`}>
              {flashcardResult.message}
            </div>
          )}
          
          {!flashcards && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Generate Flashcards</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Cards
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={numCards}
                  onChange={(e) => setNumCards(parseInt(e.target.value))}
                  className="w-32 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100"
                />
              </div>
              <button
                onClick={handleGenerateFlashcards}
                disabled={loading || !selectedSource}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Flashcards'}
              </button>
            </div>
          )}

          {flashcards && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">{flashcards.title}</h2>
                <span className="text-sm text-gray-400">
                  Card {currentCard + 1} of {flashcards.cards?.length || 0}
                </span>
              </div>

              {/* Flashcard */}
              {flashcards.cards && flashcards.cards[currentCard] && (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="relative h-64 mb-6 cursor-pointer"
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-500"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'
                    }}
                  >
                    {/* Front */}
                    <div
                      className="absolute w-full h-full bg-blue-900/30 border-2 border-blue-700 rounded-lg p-8 flex items-center justify-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <p className="text-xl text-center text-gray-100">{flashcards.cards[currentCard].front}</p>
                    </div>
                    {/* Back */}
                    <div
                      className="absolute w-full h-full bg-green-900/30 border-2 border-green-700 rounded-lg p-8 flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <p className="text-xl text-center text-gray-100">{flashcards.cards[currentCard].back}</p>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-center text-gray-400 mb-6">Click card to flip</p>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setCurrentCard(Math.max(0, currentCard - 1));
                    setIsFlipped(false);
                  }}
                  disabled={currentCard === 0}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {flashcards.cards && flashcards.cards.slice(0, Math.min(10, flashcards.cards.length)).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentCard ? 'bg-blue-500' : 'bg-gray-600'
                      }`}
                    ></div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentCard(Math.min((flashcards.cards?.length || 1) - 1, currentCard + 1));
                    setIsFlipped(false);
                  }}
                  disabled={!flashcards.cards || currentCard === flashcards.cards.length - 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>

              <button
                onClick={() => {
                  setFlashcards(null);
                  setCurrentCard(0);
                  setIsFlipped(false);
                }}
                className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Flashcard Set
              </button>
            </div>
          )}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Timeline Result Message */}
          {timelineResult && (
            <div className={`mb-6 p-4 rounded-lg ${
              timelineResult.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-red-900/30 text-red-400 border border-red-700'
            }`}>
              {timelineResult.message}
            </div>
          )}
          
          {!timeline && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Generate Timeline</h2>
              <p className="text-gray-400 mb-4">
                Extract chronological events, dates, and milestones from your study material.
              </p>
              <button
                onClick={handleGenerateTimeline}
                disabled={loading || !selectedSource}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Timeline'}
              </button>
            </div>
          )}

          {timeline && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-100">{timeline.title}</h2>
              
              {/* Timeline Events */}
              <div className="relative border-l-2 border-blue-500 pl-8 space-y-6">
                {timeline.events && timeline.events.map((event, index) => (
                  <div key={index} className="relative">
                    {/* Dot */}
                    <div className="absolute -left-9 top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-gray-800"></div>
                    
                    {/* Content */}
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-100">{event.title}</h3>
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

              <button
                onClick={() => setTimeline(null)}
                className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Timeline
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tools;
