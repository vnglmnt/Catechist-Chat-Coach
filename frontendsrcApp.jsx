import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import ChatInterface from './components/ChatInterface';
import LessonPlanGenerator from './components/LessonPlanGenerator';
import QASupport from './components/QASupport';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              <div className="text-center">
                <h1 className="text-4xl font-bold text-catholic-blue mb-4">
                  Welcome to Catechist ChatCoach
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Your AI assistant for faithful, effective catechesis
                </p>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-catholic-purple mb-2">
                      AI Chat Mentor
                    </h3>
                    <p className="text-gray-600">
                      Get guidance on teaching strategies, classroom management, and catechetical methods
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-catholic-purple mb-2">
                      Lesson Plan Generator
                    </h3>
                    <p className="text-gray-600">
                      Create age-appropriate lesson plans aligned with Catholic teaching
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-catholic-purple mb-2">
                      Q&A Support
                    </h3>
                    <p className="text-gray-600">
                      Faithful answers to difficult questions based on Church teaching
                    </p>
                  </div>
                </div>
              </div>
            } />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/lesson-plans" element={<LessonPlanGenerator />} />
            <Route path="/qa" element={<QASupport />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;