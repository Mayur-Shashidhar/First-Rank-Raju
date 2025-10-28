import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Website Info */}
        <div className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 rounded-lg p-8 border border-orange-500/30 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">🎓 First Rank Raju</h1>
            <p className="text-xl text-orange-100 mb-6">Secure Account Recovery</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="text-yellow-300 text-2xl">🔒</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Secure Authentication</h3>
                <p className="text-orange-100 text-sm">Your account is protected with industry-standard security measures and encrypted data.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="text-yellow-300 text-2xl">📧</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Email Verification</h3>
                <p className="text-orange-100 text-sm">We'll send a secure reset link to your registered email address for account recovery.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="text-yellow-300 text-2xl">⚡</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Quick Recovery</h3>
                <p className="text-orange-100 text-sm">Get back to your studies quickly with our streamlined password reset process.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="text-yellow-300 text-2xl">🛡️</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Data Protection</h3>
                <p className="text-orange-100 text-sm">Your study materials and progress remain safe and secure during the recovery process.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="bg-dark-200 rounded-lg p-8 border border-dark-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">🔐 Reset Password</h2>
            <p className="text-gray-400">Enter your email to reset your password</p>
          </div>
          {success ? (
            <div className="text-center">
              <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-gray-400 mb-6">
                If an account exists with this email, you will receive password reset instructions.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-300 text-white rounded-lg border border-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
