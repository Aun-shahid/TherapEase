import React, { useState } from 'react';
import Speech from '../components/Speech';

const SpeakerRecognition = () => {
  const [speakerData, setSpeakerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecognitionComplete = (result) => {
    setIsLoading(false);
    setSpeakerData(result);
  };

  const handleProcessingStart = () => {
    setIsLoading(true);
  };

  // Get speaker color from the speakers array
  const getSpeakerColor = (speakerName) => {
    if (!speakerData?.speakers) return 'bg-gray-500';
    const speaker = speakerData.speakers.find(s => s.name === speakerName);
    return speaker?.color || 'bg-gray-500';
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Speaker Recognition</h1>
            <p className="text-gray-600 mt-2">
              Automatically identify and distinguish between different speakers in your therapy sessions.
            </p>
          </header>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Record or Upload Session Audio</h2>
            <Speech 
              endpoint="recognize-speaker"
              onTranscriptionComplete={handleRecognitionComplete}
              onProcessingStart={handleProcessingStart}
            />
          </div>

          {isLoading && (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="text-gray-600 mt-4">Identifying speakers...</p>
              </div>
            </div>
          )}

          {speakerData && !isLoading && (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Speaker Recognition Results</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-700 mb-2">Total Speakers</h3>
                    <div className="text-2xl font-bold text-indigo-600">{speakerData.totalSpeakers}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-700 mb-2">Session Duration</h3>
                    <div className="text-2xl font-bold text-indigo-600">{speakerData.duration}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-700 mb-2">Total Utterances</h3>
                    <div className="text-2xl font-bold text-indigo-600">{speakerData.diarized_conversation.length}</div>
                  </div>
                </div>
                
                <h3 className="font-medium text-gray-700 mb-3">Speaker Breakdown</h3>
                
                {speakerData.speakers.map((speaker, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${speaker.color}`}></span>
                        {speaker.name}
                      </div>
                      <div className="text-gray-600 text-sm">{speaker.timeSpoken} ({speaker.percentage}%)</div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${speaker.color}`} 
                        style={{ width: `${speaker.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-3">Session Transcript with Speaker Labels</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {speakerData.diarized_conversation.map((item, index) => (
                        <div key={index} className="flex flex-col">
                          <span className={`font-semibold ${getSpeakerColor(item.speaker)} text-white px-2 py-1 rounded-md inline-block w-fit`}>
                            {item.speaker}
                          </span>
                          <span className="text-gray-700 mt-2">{item.utterance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Export Speakers Data
                </button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Download Full Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakerRecognition;