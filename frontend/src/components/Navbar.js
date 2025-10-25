import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-500' : 'text-gray-400';
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="bg-dark-200 border-b border-dark-300 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">First Rank Raju</h1>
        </div>
        
        <div className="flex items-center space-x-8">
          <Link 
            to="/" 
            className={`hover:text-blue-400 transition-colors ${isActive('/')}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/tools" 
            className={`hover:text-blue-400 transition-colors ${isActive('/tools')}`}
          >
            Tools
          </Link>
          <Link 
            to="/chat" 
            className={`hover:text-blue-400 transition-colors ${isActive('/chat')}`}
          >
            Chat
          </Link>
          <Link 
            to="/performance" 
            className={`hover:text-blue-400 transition-colors ${isActive('/performance')}`}
          >
            Performance
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-gray-400 text-sm">
              Hi, {user.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
