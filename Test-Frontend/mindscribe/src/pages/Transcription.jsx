import React, { useState, useEffect } from 'react';
import Speech from '../components/Speech';

const Transcription = () => {
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcriptionStats, setTranscriptionStats] = useState(null);

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log('State changed:', {
      transcription,
      isLoading,
      hasStats: !!transcriptionStats
    });
  }, [transcription, isLoading, transcriptionStats]);

  const handleTranscriptionComplete = (result) => {
    console.log('Transcription Complete - Raw Result:', result);
    setIsLoading(false);
    
    // Handle both string and object responses
    const transcriptionText = typeof result === 'string' ? result : (result?.transcription || '');
    console.log('Processed transcription text:', transcriptionText);
    
    if (transcriptionText) {
      console.log('Setting transcription state with:', transcriptionText);
      setTranscription(transcriptionText);
      
      // Calculate transcription statistics
      const words = transcriptionText.trim().split(/\s+/).length;
      const sentences = (transcriptionText.match(/[.!?]+/g) || []).length;
      const minutes = Math.floor(words / 150); // Assuming average speaking rate
      const seconds = Math.floor((words / 150 * 60) % 60);
      
      const stats = {
        words,
        sentences,
        duration: `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`,
        accuracy: '98%'
      };
      
      console.log('Setting transcription stats:', stats);
      setTranscriptionStats(stats);
    } else {
      console.warn('No transcription in result:', result);
    }
  };

  const handleProcessingStart = () => {
    console.log('Starting transcription processing...');
    setIsLoading(true);
    // Reset states when starting new transcription
    setTranscription('');
    setTranscriptionStats(null);
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Speech Transcription</h1>
            <p className="text-gray-600 mt-2">
              Convert your therapy sessions into accurate, searchable text.
            </p>
          </header>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Record or Upload Audio</h2>
            <Speech 
              endpoint="transcribe"
              onTranscriptionComplete={handleTranscriptionComplete}
              onProcessingStart={handleProcessingStart}
            />
          </div>

          {isLoading && (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="text-gray-600 mt-4">Transcribing audio...</p>
              </div>
            </div>
          )}

          {/* Debug info */}
          <div className="mb-4 p-4 bg-gray-100 rounded">
            <p>Debug Info:</p>
            <p>Has Transcription: {transcription ? 'Yes' : 'No'}</p>
            <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>Has Stats: {transcriptionStats ? 'Yes' : 'No'}</p>
          </div>

          {transcription && !isLoading && (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Transcription Results</h2>
                <div className="flex space-x-3">
                  <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {transcriptionStats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Words</div>
                    <div className="text-xl font-semibold text-gray-900">{transcriptionStats.words}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Sentences</div>
                    <div className="text-xl font-semibold text-gray-900">{transcriptionStats.sentences}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="text-xl font-semibold text-gray-900">{transcriptionStats.duration}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Accuracy</div>
                    <div className="text-xl font-semibold text-gray-900">{transcriptionStats.accuracy}</div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Full Transcript</h3>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-500 hover:text-indigo-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <button className="p-1 text-gray-500 hover:text-indigo-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                  <p 
                    className="text-gray-600 whitespace-pre-wrap leading-relaxed text-right"
                    dir="rtl"
                    lang="ur"
                    style={{ 
                      fontFamily: 'Noto Nastaliq Urdu, serif',
                      fontSize: '1.25rem',
                      lineHeight: '2.5'
                    }}
                  >
                    {transcription}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-gray-800 mb-4">Transcript Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Download Transcript
                  </button>
                  <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                    Share Transcript
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    Generate Summary
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transcription;