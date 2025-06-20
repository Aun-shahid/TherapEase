import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Transcription from './pages/Transcription';
import SpeakerRecognition from './pages/SpeakerRecognition';
import SentimentAnalysis from './pages/SentimentAnalysis';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full">
        <nav className="sticky top-0 z-10 bg-white border-b shadow-sm w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <span className="text-xl font-bold text-indigo-600">MindScribe</span>
                </Link>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/transcription" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-600">
                  Transcription
                </Link>
                <Link to="/speaker-recognition" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-600">
                  Speaker Recognition
                </Link>
                <Link to="/sentiment-analysis" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-600">
                  Sentiment Analysis
                </Link>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transcription" element={<Transcription />} />
            <Route path="/speaker-recognition" element={<SpeakerRecognition />} />
            <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t py-4">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} MindScribe. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;