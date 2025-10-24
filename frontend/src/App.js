import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Tools from './pages/Tools';
import Performance from './pages/Performance';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-100">
        <Navbar />
        <div className="flex">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/performance" element={<Performance />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
