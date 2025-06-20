import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/speech';

export interface TranscriptionResponse {
  transcription: string;
  error?: string;
}

export interface Utterance {
  speaker: string;
  utterance: string;
}

export interface SpeakerStats {
  name: string;
  timeSpoken: string;
  percentage: number;
  color: string;
}

export interface SpeakerRecognitionResponse {
  diarized_conversation: Utterance[];
  speakers: SpeakerStats[];
  totalSpeakers: number;
  duration: string;
  error?: string;
}

export interface SentimentData {
  primary_emotion: string;
  emotion_intensity: number;
  brief_analysis?: string;
  therapeutic_significance?: string;
}

export interface UtteranceWithSentiment {
  speaker: string;
  utterance: string;
  sentiment_data: SentimentData;
}

export interface SentimentAnalysisResponse {
  analyzed_conversation: UtteranceWithSentiment[];
  overallSentiment: string;
  confidenceScore: number;
  duration: string;
  emotionalPatterns: {
    positive: number;
    neutral: number;
    mixed: number;
    negative: number;
  };
  detailedAnalysis: string;
}

class TranscriptionService {
  async transcribeAudio(audioData: Blob | File): Promise<TranscriptionResponse> {
    const formData = new FormData();
    formData.append('audio_file', audioData);

    try {
      console.log('Sending transcription request...');
      const response = await axios.post(`${API_BASE_URL}/transcribe/audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Transcription API Response:', response.data);
      
      // Handle both object and string responses
      const transcribedText = typeof response.data === 'string' 
        ? response.data 
        : response.data.transcribed_text || '';
      
      const transformedResponse = {
        transcription: transcribedText
      };
      
      console.log('Transformed Response:', transformedResponse);
      return transformedResponse;
    } catch (error) {
      console.error('Transcription Error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  async recognizeSpeakers(audioData: Blob | File): Promise<SpeakerRecognitionResponse> {
    const formData = new FormData();
    formData.append('audio_file', audioData);

    try {
      console.log('Sending speaker recognition request...');
      const response = await axios.post(`${API_BASE_URL}/speaker_recognition/audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Speaker Recognition API Response:', response.data);
      
      // Transform the response to match our interface
      const diarizedData = response.data.diarized_conversation;
      
      // Calculate speaker statistics and assign colors
      const speakerStats = new Map<string, { count: number, utterances: string[] }>();
      diarizedData.forEach((item: Utterance) => {
        if (!speakerStats.has(item.speaker)) {
          speakerStats.set(item.speaker, { count: 0, utterances: [] });
        }
        const stats = speakerStats.get(item.speaker)!;
        stats.count++;
        stats.utterances.push(item.utterance);
      });

      // Define colors for speakers
      const speakerColors = [
        'bg-indigo-500',
        'bg-emerald-500',
        'bg-rose-500',
        'bg-amber-500',
        'bg-cyan-500',
        'bg-purple-500'
      ];

      // Convert to array format with colors
      const speakers = Array.from(speakerStats.entries()).map(([name, stats], index) => ({
        name,
        timeSpoken: `${stats.count} utterances`,
        percentage: Math.round((stats.count / diarizedData.length) * 100),
        color: speakerColors[index % speakerColors.length]
      }));

      return {
        diarized_conversation: diarizedData,
        speakers,
        totalSpeakers: speakers.length,
        duration: `${diarizedData.length} utterances`
      };
    } catch (error) {
      console.error('Speaker Recognition Error:', error);
      throw new Error('Failed to recognize speakers');
    }
  }

  async analyzeSentiment(audioData: Blob | File): Promise<SentimentAnalysisResponse> {
    const formData = new FormData();
    formData.append('audio_file', audioData);

    try {
      console.log('Sending sentiment analysis request...');
      const response = await axios.post(`${API_BASE_URL}/sentiment_analysis/audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Sentiment Analysis API Response:', response.data);
      
      const analyzedData = response.data.analyzed_conversation;
      
      // Calculate emotional patterns
      const emotionCounts = {
        positive: 0,
        neutral: 0,
        mixed: 0,
        negative: 0
      };

      analyzedData.forEach((item: UtteranceWithSentiment) => {
        const emotion = item.sentiment_data.primary_emotion.toLowerCase();
        if (emotion === 'joy' || emotion === 'happiness') {
          emotionCounts.positive++;
        } else if (emotion === 'neutral') {
          emotionCounts.neutral++;
        } else if (emotion === 'anxiety' || emotion === 'fear') {
          emotionCounts.negative++;
        } else {
          emotionCounts.mixed++;
        }
      });

      // Calculate percentages
      const total = analyzedData.length;
      const emotionalPatterns = {
        positive: Math.round((emotionCounts.positive / total) * 100),
        neutral: Math.round((emotionCounts.neutral / total) * 100),
        mixed: Math.round((emotionCounts.mixed / total) * 100),
        negative: Math.round((emotionCounts.negative / total) * 100)
      };

      // Determine overall sentiment
      let overallSentiment = 'Neutral';
      if (emotionalPatterns.positive > emotionalPatterns.negative) {
        overallSentiment = 'Positive';
      } else if (emotionalPatterns.negative > emotionalPatterns.positive) {
        overallSentiment = 'Negative';
      }

      // Generate detailed analysis
      const detailedAnalysis = analyzedData
        .filter(item => item.sentiment_data.brief_analysis)
        .map(item => `${item.speaker}: ${item.sentiment_data.brief_analysis}`)
        .join('\n\n');

      return {
        analyzed_conversation: analyzedData,
        overallSentiment,
        confidenceScore: 85, // This could be calculated based on emotion intensity
        duration: `${analyzedData.length} utterances`,
        emotionalPatterns,
        detailedAnalysis
      };
    } catch (error) {
      console.error('Sentiment Analysis Error:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }
}

export const transcriptionService = new TranscriptionService();
