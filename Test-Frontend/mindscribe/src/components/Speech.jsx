import React, { useState, useRef } from 'react';
import { useAudioProcessing } from '../hooks/useAudioProcessing';
import RecordRTC from 'recordrtc';

const Speech = ({ onTranscriptionComplete, endpoint }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const recorderRef = useRef(null);
  const { processAudio, loading, error, result } = useAudioProcessing();

  const cleanupPreviousAudio = () => {
    // Revoke the previous audio URL to free up memory
    if (audioSource) {
      URL.revokeObjectURL(audioSource);
    }
    setAudioBlob(null);
    setSelectedFile(null);
    setAudioSource(null);
  };

  const startRecording = async () => {
    try {
      // Clean up any previous audio
      cleanupPreviousAudio();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16
        } 
      });

      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
        bufferSize: 4096,
        timeSlice: 1000,
        ondataavailable: (blob) => {
          console.log('Recording data available:', blob);
        }
      });

      recorderRef.current = recorder;
      recorder.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob();
        setAudioBlob(blob);
        setAudioSource(URL.createObjectURL(blob));
        setSelectedFile(null);
        
        // Stop all tracks
        recorderRef.current.stream.getTracks().forEach(track => track.stop());
      });
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Clean up any previous audio
        cleanupPreviousAudio();

        // Check if the file type is supported
        const supportedTypes = ['.mp3', '.mp4', '.mpeg', '.m4a', '.wav', '.webm'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!supportedTypes.includes(fileExtension)) {
          throw new Error(`Unsupported file type. Please upload one of: ${supportedTypes.join(', ')}`);
        }

        setSelectedFile(file);
        setAudioSource(URL.createObjectURL(file));
      } catch (error) {
        console.error('Error handling audio file:', error);
      }
    }
  };

  const handleSubmit = async () => {
    const audioData = audioBlob || selectedFile;
    if (!audioData) return;

    console.log('Submitting audio for processing...');
    try {
      const response = await processAudio(audioData, endpoint);
      console.log('Processing complete, response:', response);
      
      if (response && onTranscriptionComplete) {
        console.log('Calling onTranscriptionComplete with:', response);
        onTranscriptionComplete(response);
      } else {
        console.warn('No response or callback available:', { response, hasCallback: !!onTranscriptionComplete });
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium transition-colors ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          }`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        <label className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium cursor-pointer transition-colors text-center">
          Upload Audio
          <input
            type="file"
            accept=".mp3,.mp4,.mpeg,.m4a,.wav,.webm"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
      
      {audioSource && (
        <div className="w-full space-y-4">
          <audio controls className="w-full">
            <source src={audioSource} type={selectedFile?.type || 'audio/wav'} />
            Your browser does not support the audio element.
          </audio>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : 'Submit Audio for Processing'}
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default Speech;