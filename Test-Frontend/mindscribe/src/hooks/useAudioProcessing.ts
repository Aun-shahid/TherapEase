import { useState } from 'react';
import { transcriptionService, TranscriptionResponse, SpeakerRecognitionResponse, SentimentAnalysisResponse } from '../services/transcription.service';

type ProcessingType = 'transcribe' | 'recognize-speaker' | 'analyze-sentiment';

interface AudioProcessingState {
  loading: boolean;
  error: string | null;
  result: TranscriptionResponse | SpeakerRecognitionResponse | SentimentAnalysisResponse | null;
}

export const useAudioProcessing = () => {
  const [state, setState] = useState<AudioProcessingState>({
    loading: false,
    error: null,
    result: null
  });

  const processAudio = async (audioData: Blob | File, type: ProcessingType) => {
    console.log('Starting audio processing...');
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      let response;
      
      switch (type) {
        case 'transcribe':
          console.log('Processing transcription...');
          response = await transcriptionService.transcribeAudio(audioData);
          console.log('Transcription response:', response);
          break;
        case 'recognize-speaker':
          response = await transcriptionService.recognizeSpeakers(audioData);
          break;
        case 'analyze-sentiment':
          response = await transcriptionService.analyzeSentiment(audioData);
          break;
        default:
          throw new Error('Invalid processing type');
      }
      
      console.log('Setting state with response:', response);
      setState(prev => ({ 
        ...prev, 
        result: response,
        loading: false 
      }));
      
      return response;
    } catch (err) {
      console.error('Error in processAudio:', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'An error occurred',
        loading: false 
      }));
      throw err;
    }
  };

  return {
    processAudio,
    ...state
  };
}; 