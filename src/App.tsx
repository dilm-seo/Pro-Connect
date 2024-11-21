import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AuthProvider from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Opportunities from './pages/Opportunities';
import Professionals from './pages/Professionals';
import Companies from './pages/Companies';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Features />
                </>
              } />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/professionals" element={<Professionals />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}