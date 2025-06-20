from fastapi import APIRouter, HTTPException, File, UploadFile, status
import os
import json
import logging
import io
from typing import Dict, Any, List, Tuple, Optional
from ..models.speaker_recognition import DiarizationResponse, Utterance
from groq import Groq
from dotenv import load_dotenv
from pydub import AudioSegment
from pydub.silence import split_on_silence, detect_silence
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

router = APIRouter()

groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY is not set")

client = Groq(api_key=groq_api_key)

def preprocess_audio(audio_bytes: bytes) -> AudioSegment:
    """
    Preprocess audio: convert to WAV format and remove silence from start/end.
    
    Args:
        audio_bytes (bytes): Raw audio file bytes
        
    Returns:
        AudioSegment: Preprocessed audio
    """
    try:
        # Load audio (pydub can handle multiple formats)
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
        
        # Convert to WAV format (16kHz, mono, 16-bit)
        audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
        
        # Remove silence from start and end
        # Detect silence at beginning and end
        silence_thresh = audio.dBFS - 14  # Silence threshold
        
        # Find first non-silent segment
        start_trim = 0
        for i in range(0, len(audio), 100):  # Check every 100ms
            chunk = audio[i:i+100]
            if chunk.dBFS > silence_thresh:
                start_trim = i
                break
        
        # Find last non-silent segment
        end_trim = len(audio)
        for i in range(len(audio), 0, -100):  # Check backwards every 100ms
            chunk = audio[max(0, i-100):i]
            if chunk.dBFS > silence_thresh:
                end_trim = i
                break
        
        # Trim silence
        audio = audio[start_trim:end_trim]
        
        logger.info(f"Audio preprocessed: {len(audio)/1000:.2f}s duration, trimmed {start_trim/1000:.2f}s from start, {(len(audio_bytes) - end_trim)/1000:.2f}s from end")
        
        return audio
        
    except Exception as e:
        logger.error(f"Error preprocessing audio: {str(e)}")
        raise ValueError(f"Could not process audio file: {str(e)}")

def detect_speaker_segments(audio: AudioSegment) -> List[Tuple[int, int, str]]:
    """
    Detect speaker segments using voice activity detection and basic speaker change detection.
    This is a simplified approach using silence detection and audio characteristics.
    
    Args:
        audio (AudioSegment): Preprocessed audio
        
    Returns:
        List[Tuple[int, int, str]]: List of (start_ms, end_ms, speaker_id) tuples
    """
    try:
        # Split audio on silence to find speech segments
        silence_thresh = audio.dBFS - 16
        min_silence_len = 500  # 500ms minimum silence
        keep_silence = 200     # Keep 200ms of silence
        
        chunks = split_on_silence(
            audio,
            min_silence_len=min_silence_len,
            silence_thresh=silence_thresh,
            keep_silence=keep_silence
        )
        
        if not chunks:
            # If no chunks found, treat entire audio as one speaker
            return [(0, len(audio), "Speaker_1")]
        
        # Analyze chunks for speaker characteristics
        speaker_segments = []
        current_time = 0
        current_speaker = "Speaker_1"
        speaker_count = 1
        
        # Simple heuristics for speaker change detection
        prev_avg_db = None
        prev_max_freq = None
        
        for i, chunk in enumerate(chunks):
            chunk_start = current_time
            chunk_end = current_time + len(chunk)
            
            # Analyze chunk characteristics
            avg_db = chunk.dBFS
            
            # Simple frequency analysis (very basic)
            samples = np.array(chunk.get_array_of_samples())
            if len(samples) > 0:
                fft = np.fft.fft(samples)
                freqs = np.fft.fftfreq(len(fft))
                max_freq_idx = np.argmax(np.abs(fft[:len(fft)//2]))
                max_freq = abs(freqs[max_freq_idx])
            else:
                max_freq = 0
            
            # Detect potential speaker change
            speaker_changed = False
            if prev_avg_db is not None and prev_max_freq is not None:
                db_diff = abs(avg_db - prev_avg_db)
                freq_diff = abs(max_freq - prev_max_freq)
                
                # Simple thresholds for speaker change
                if db_diff > 5 or freq_diff > 0.1:  # Adjust thresholds as needed
                    # Check if we should introduce a new speaker
                    if len(speaker_segments) > 0:
                        # Look at timing - if there's a significant pause, likely speaker change
                        last_segment_end = speaker_segments[-1][1]
                        pause_duration = chunk_start - last_segment_end
                        
                        if pause_duration > 1000:  # 1 second pause
                            speaker_changed = True
            
            if speaker_changed and speaker_count < 4:  # Limit to 4 speakers max
                speaker_count += 1
                current_speaker = f"Speaker_{speaker_count}"
            
            speaker_segments.append((chunk_start, chunk_end, current_speaker))
            
            # Update for next iteration
            current_time = chunk_end
            prev_avg_db = avg_db
            prev_max_freq = max_freq
            
            # Add silence gap to current_time if not last chunk
            if i < len(chunks) - 1:
                current_time += min_silence_len
        
        logger.info(f"Detected {len(speaker_segments)} speech segments with {speaker_count} unique speakers")
        return speaker_segments
        
    except Exception as e:
        logger.error(f"Error in speaker segment detection: {str(e)}")
        # Fallback: treat entire audio as one speaker
        return [(0, len(audio), "Speaker_1")]

def create_speaker_audio_segments(audio: AudioSegment, speaker_segments: List[Tuple[int, int, str]]) -> Dict[str, List[AudioSegment]]:
    """
    Create audio segments grouped by speaker.
    
    Args:
        audio (AudioSegment): Original audio
        speaker_segments (List[Tuple[int, int, str]]): Speaker segment information
        
    Returns:
        Dict[str, List[AudioSegment]]: Dictionary mapping speaker to their audio segments
    """
    speaker_audio = {}
    
    for start_ms, end_ms, speaker_id in speaker_segments:
        if speaker_id not in speaker_audio:
            speaker_audio[speaker_id] = []
        
        # Extract audio segment
        segment = audio[start_ms:end_ms]
        speaker_audio[speaker_id].append(segment)
    
    return speaker_audio

def split_audio_for_transcription(audio_segments: List[AudioSegment], max_duration: int = 30) -> List[AudioSegment]:
    """
    Split long audio segments into smaller chunks for transcription.
    
    Args:
        audio_segments (List[AudioSegment]): Audio segments from one speaker
        max_duration (int): Maximum duration in seconds
        
    Returns:
        List[AudioSegment]: List of audio chunks ready for transcription
    """
    chunks = []
    max_duration_ms = max_duration * 1000
    
    for segment in audio_segments:
        if len(segment) <= max_duration_ms:
            chunks.append(segment)
        else:
            # Split long segments
            start = 0
            while start < len(segment):
                end = min(start + max_duration_ms, len(segment))
                chunks.append(segment[start:end])
                start = end
    
    return chunks

async def transcribe_speaker_audio(speaker_audio: Dict[str, List[AudioSegment]]) -> Dict[str, str]:
    """
    Transcribe audio segments for each speaker.
    
    Args:
        speaker_audio (Dict[str, List[AudioSegment]]): Speaker audio segments
        
    Returns:
        Dict[str, str]: Transcriptions for each speaker
    """
    speaker_transcripts = {}
    
    for speaker_id, audio_segments in speaker_audio.items():
        logger.info(f"Transcribing {len(audio_segments)} segments for {speaker_id}")
        
        # Split segments into transcription-sized chunks
        transcription_chunks = split_audio_for_transcription(audio_segments, max_duration=30)
        
        speaker_text_parts = []
        
        for i, chunk in enumerate(transcription_chunks):
            try:
                # Convert chunk to bytes
                buffer = io.BytesIO()
                chunk.export(buffer, format="wav")
                chunk_bytes = buffer.getvalue()
                
                # Transcribe with Groq Whisper
                transcription_response = client.audio.transcriptions.create(
                    file=(f"{speaker_id}_chunk_{i}.wav", chunk_bytes),
                    model="whisper-large-v3",
                    response_format="json",
                    language="ur",
                    prompt="Transcribe this Urdu audio accurately, preserving both Urdu and English words. Maintain natural speech patterns."
                )
                
                if transcription_response.text.strip():
                    speaker_text_parts.append(transcription_response.text.strip())
                    
            except Exception as e:
                logger.warning(f"Failed to transcribe chunk {i} for {speaker_id}: {str(e)}")
                continue
        
        # Combine all text parts for this speaker
        speaker_transcripts[speaker_id] = " ".join(speaker_text_parts)
        logger.info(f"Completed transcription for {speaker_id}: {len(speaker_transcripts[speaker_id])} characters")
    
    return speaker_transcripts

def create_diarized_conversation(speaker_segments: List[Tuple[int, int, str]], speaker_transcripts: Dict[str, str]) -> List[Dict[str, str]]:
    """
    Create the final diarized conversation by combining timing and transcription information.
    
    Args:
        speaker_segments (List[Tuple[int, int, str]]): Speaker timing information
        speaker_transcripts (Dict[str, str]): Transcribed text for each speaker
        
    Returns:
        List[Dict[str, str]]: Diarized conversation
    """
    conversation = []
    
    # Group segments by speaker and estimate text distribution
    speaker_segment_counts = {}
    for _, _, speaker_id in speaker_segments:
        speaker_segment_counts[speaker_id] = speaker_segment_counts.get(speaker_id, 0) + 1
    
    # Distribute transcribed text across segments for each speaker
    speaker_text_parts = {}
    for speaker_id, full_text in speaker_transcripts.items():
        if not full_text.strip():
            continue
            
        segment_count = speaker_segment_counts.get(speaker_id, 1)
        
        # Simple approach: split text by sentences and distribute
        sentences = [s.strip() for s in full_text.split('۔') if s.strip()]
        if not sentences:
            sentences = [full_text.strip()]
        
        # Distribute sentences across segments
        sentences_per_segment = max(1, len(sentences) // segment_count)
        text_parts = []
        
        for i in range(0, len(sentences), sentences_per_segment):
            part = '۔ '.join(sentences[i:i + sentences_per_segment])
            if part and not part.endswith('۔'):
                part += '۔'
            if part:
                text_parts.append(part)
        
        speaker_text_parts[speaker_id] = text_parts
    
    # Create conversation with proper timing
    speaker_text_indices = {speaker_id: 0 for speaker_id in speaker_transcripts.keys()}
    
    for start_ms, end_ms, speaker_id in speaker_segments:
        if speaker_id in speaker_text_parts and speaker_text_indices[speaker_id] < len(speaker_text_parts[speaker_id]):
            utterance = speaker_text_parts[speaker_id][speaker_text_indices[speaker_id]]
            speaker_text_indices[speaker_id] += 1
            
            if utterance.strip():
                conversation.append({
                    "speaker": speaker_id,
                    "utterance": utterance.strip()
                })
    
    return conversation

@router.post("/speaker_recognition/audio")
async def speaker_recognition(audio_file: UploadFile = File(...)):
    """
    Process audio file with speaker diarization first, then transcription.
    This approach segments the audio by speakers before transcription for better accuracy.

    Args:
        audio_file (UploadFile): The audio file to process (any format supported by pydub)

    Returns:
        DiarizationResponse: Response containing the diarized conversation
    """
    
    try:
        # Read the audio file
        audio_bytes = await audio_file.read()
        logger.info(f"Processing audio file: {audio_file.filename}, size: {len(audio_bytes)} bytes")
        
        if len(audio_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded audio file is empty."
            )

        # Step 1: Preprocess audio (convert to WAV, trim silence)
        try:
            preprocessed_audio = preprocess_audio(audio_bytes)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid audio file: {str(e)}"
            )

        # Step 2: Detect speaker segments using voice characteristics
        speaker_segments = detect_speaker_segments(preprocessed_audio)
        
        if not speaker_segments:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not detect any speech segments in the audio."
            )

        # Step 3: Group audio segments by speaker
        speaker_audio = create_speaker_audio_segments(preprocessed_audio, speaker_segments)
        
        # Step 4: Transcribe each speaker's audio segments
        speaker_transcripts = await transcribe_speaker_audio(speaker_audio)
        
        if not speaker_transcripts or not any(text.strip() for text in speaker_transcripts.values()):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not transcribe any speech from the audio file."
            )

        # Step 5: Create final diarized conversation
        diarized_conversation = create_diarized_conversation(speaker_segments, speaker_transcripts)
        
        if not diarized_conversation:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not create diarized conversation from the processed audio."
            )

        # Step 6: Return the response
        response = DiarizationResponse(diarized_conversation=diarized_conversation)
        logger.info(f"Speaker recognition completed: {len(diarized_conversation)} utterances from {len(set(item['speaker'] for item in diarized_conversation))} speakers")
        
        return response

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
        
    except Exception as e:
        logger.error(f"Unexpected error during speaker recognition: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during audio processing."
        )