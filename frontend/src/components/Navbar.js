import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-500' : 'text-gray-400';
  };

  return (
    <nav className="bg-dark-200 border-b border-dark-300 px-6 py-4">
      <div className="flex items-center justify-center">
        <div className="absolute left-6">
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
      </div>
    </nav>
  );
};

export default Navbar;
