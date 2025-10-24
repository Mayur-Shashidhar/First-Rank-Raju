import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Performance = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/performance`);
      if (response.data.success) {
        setQuizzes(response.data.data.quizzes || []);
        setStats(response.data.data.stats || {
          totalAttempts: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0
        });
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-2">Performance Dashboard</h1>
      <p className="text-gray-400 mb-8">Track your progress and quiz history</p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Total Quizzes</p>
              <p className="text-3xl font-bold text-gray-100">{stats.totalAttempts}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Average Score</p>
              <p className="text-3xl font-bold text-blue-400">{stats.averageScore}%</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Highest Score</p>
              <p className="text-3xl font-bold text-green-400">{stats.highestScore}%</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Lowest Score</p>
              <p className="text-3xl font-bold text-red-400">{stats.lowestScore}%</p>
            </div>
          </div>

          {/* Quiz History */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Quiz History</h2>
            
            {quizzes.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-400 text-lg mb-2">No quiz attempts yet</p>
                <p className="text-gray-500 text-sm mb-4">Take your first quiz to see your performance here</p>
                <a href="/tools" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Go to Tools
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {quizzes.map((quiz) => (
                  <div 
                    key={quiz._id} 
                    className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors cursor-pointer"
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
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        quiz.percentage >= 80 ? 'bg-green-900/30 text-green-400 border border-green-700' :
                        quiz.percentage >= 60 ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700' :
                        'bg-red-900/30 text-red-400 border border-red-700'
                      }`}>
                        {quiz.percentage >= 80 ? 'Excellent' :
                         quiz.percentage >= 60 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance Insights */}
          {quizzes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Subject Breakdown */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-gray-100 mb-4">Subject Breakdown</h2>
                <div className="space-y-3">
                  {(() => {
                    const subjectStats = {};
                    quizzes.forEach(quiz => {
                      if (!subjectStats[quiz.subject]) {
                        subjectStats[quiz.subject] = { count: 0, totalScore: 0 };
                      }
                      subjectStats[quiz.subject].count++;
                      subjectStats[quiz.subject].totalScore += quiz.percentage;
                    });

                    return Object.entries(subjectStats).map(([subject, data]) => (
                      <div key={subject} className="bg-gray-700/50 p-3 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-200 font-medium">{subject}</span>
                          <span className="text-blue-400">{(data.totalScore / data.count).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>{data.count} quiz{data.count !== 1 ? 'zes' : ''}</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Recent Progress */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-gray-100 mb-4">Recent Progress</h2>
                <div className="space-y-4">
                  {quizzes.slice(0, 5).map((quiz, index) => (
                    <div key={quiz._id} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        quiz.percentage >= 80 ? 'bg-green-900/30 text-green-400' :
                        quiz.percentage >= 60 ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {quiz.percentage}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-200 text-sm font-medium truncate">{quiz.title}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(quiz.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Performance;
