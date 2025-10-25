import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Tools from './pages/Tools';
import Performance from './pages/Performance';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './App.css';

function AppContent() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark-100">
      {isAuthenticated && <Navbar onLogout={logout} />}
      <div className="flex">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={login} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Signup />
            } 
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tools" 
            element={
              <ProtectedRoute>
                <Tools />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/performance" 
            element={
              <ProtectedRoute>
                <Performance />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to login if not authenticated, otherwise dashboard */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
