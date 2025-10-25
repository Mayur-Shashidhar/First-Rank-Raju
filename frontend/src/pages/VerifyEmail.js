import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/auth/verify-email?token=${token}`);

        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message);

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed');
      }
    };

    verifyEmail();
  }, [searchParams, navigate, API_URL]);

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-dark-200 rounded-lg p-8 border border-dark-300 text-center">
          {status === 'verifying' && (
            <div>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Verifying Email...</h2>
              <p className="text-gray-400">Please wait while we verify your email address</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-green-400 mb-4">{message}</p>
              <p className="text-gray-400 text-sm">Redirecting to login page...</p>
              <Link
                to="/login"
                className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-red-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Go to Login
                </Link>
                <Link
                  to="/signup"
                  className="block w-full px-6 py-3 bg-dark-300 hover:bg-dark-400 text-white font-medium rounded-lg transition-colors"
                >
                  Sign Up Again
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
