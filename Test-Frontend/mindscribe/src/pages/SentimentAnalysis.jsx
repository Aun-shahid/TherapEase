import React, { useState } from 'react';
import Speech from '../components/Speech';

const SentimentAnalysis = () => {
  const [sentimentData, setSentimentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisComplete = (result) => {
    setIsLoading(false);
    setSentimentData(result);
  };

  const handleAnalysisStart = () => {
    setIsLoading(true);
  };

  const getEmotionColor = (emotion) => {
    const emotionMap = {
      joy: 'bg-green-500',
      happiness: 'bg-green-500',
      neutral: 'bg-blue-500',
      anxiety: 'bg-red-500',
      fear: 'bg-red-500',
      sadness: 'bg-purple-500',
      anger: 'bg-orange-500'
    };
    return emotionMap[emotion.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sentiment Analysis</h1>
            <p className="text-gray-600 mt-2">
              Analyze the emotional tone and sentiment patterns in your therapy sessions.
            </p>
          </header>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Record or Upload Audio</h2>
            <Speech 
              endpoint="analyze-sentiment"
              onTranscriptionComplete={handleAnalysisComplete}
              onProcessingStart={handleAnalysisStart}
            />
          </div>

          {isLoading && (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="text-gray-600 mt-4">Analyzing sentiment...</p>
              </div>
            </div>
          )}

          {sentimentData && !isLoading && (
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Sentiment Analysis Results</h2>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-700 mb-2">Overall Sentiment</h3>
                    <div className="text-2xl font-bold text-indigo-600">{sentimentData.overallSentiment}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-700 mb-2">Confidence Score</h3>
                    <div className="text-2xl font-bold text-indigo-600">{sentimentData.confidenceScore}%</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium text-gray-700 mb-2">Duration</h3>
                    <div className="text-2xl font-bold text-indigo-600">{sentimentData.duration}</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-3">Emotional Patterns</h3>
                  <div className="h-12 bg-gray-200 rounded-full overflow-hidden">
                    <div className="flex h-full">
                      <div className="bg-green-500 h-full" style={{ width: `${sentimentData.emotionalPatterns.positive}%` }}></div>
                      <div className="bg-blue-500 h-full" style={{ width: `${sentimentData.emotionalPatterns.neutral}%` }}></div>
                      <div className="bg-yellow-500 h-full" style={{ width: `${sentimentData.emotionalPatterns.mixed}%` }}></div>
                      <div className="bg-red-500 h-full" style={{ width: `${sentimentData.emotionalPatterns.negative}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>Positive ({sentimentData.emotionalPatterns.positive}%)</span>
                    <span>Neutral ({sentimentData.emotionalPatterns.neutral}%)</span>
                    <span>Mixed ({sentimentData.emotionalPatterns.mixed}%)</span>
                    <span>Negative ({sentimentData.emotionalPatterns.negative}%)</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-gray-700 mb-3">Analyzed Conversation</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {sentimentData.analyzed_conversation.map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-800">{item.speaker}</span>
                          <span className={`px-2 py-1 rounded text-sm text-white ${getEmotionColor(item.sentiment_data.primary_emotion)}`}>
                            {item.sentiment_data.primary_emotion} (Intensity: {item.sentiment_data.emotion_intensity}/5)
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{item.utterance}</p>
                        {item.sentiment_data.brief_analysis && (
                          <div className="mt-2 text-sm text-gray-500 italic">
                            Analysis: {item.sentiment_data.brief_analysis}
                          </div>
                        )}
                        {item.sentiment_data.therapeutic_significance && (
                          <div className="mt-1 text-sm text-indigo-600">
                            Clinical Note: {item.sentiment_data.therapeutic_significance}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-right">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;