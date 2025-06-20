import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Mind<span className="text-indigo-600">Scribe</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            AI-Powered Therapy Assistant for Enhanced Patient Care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link to="/transcription" className="group">
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🎙️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Speech Transcription</h3>
              <p className="text-gray-600 text-center">Convert therapy sessions to accurately transcribed text with our advanced speech recognition engine.</p>
            </div>
          </Link>

          <Link to="/speaker-recognition" className="group">
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center transform hover:-translate-y-1">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Speaker Recognition</h3>
              <p className="text-gray-600 text-center">Distinguish between therapist and client voices automatically for organized session analytics.</p>
            </div>
          </Link>

          <Link to="/sentiment-analysis" className="group">
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center transform hover:-translate-y-1">
              <div className="text-4xl mb-4">😊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Sentiment Analysis</h3>
              <p className="text-gray-600 text-center">Gain insights into emotional patterns and progress throughout therapy sessions.</p>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Powered by advanced AI technology for mental health professionals
          </p>
          <button className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;