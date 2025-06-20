from fastapi import APIRouter, HTTPException, File, UploadFile
import os
import torch
import torchaudio
from transformers import AutoModel
import tempfile
import asyncio
from functools import lru_cache
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Supported audio formats
SUPPORTED_FORMATS = {
    "audio/mpeg", "audio/mp3", "audio/mp4", "audio/m4a",
    "audio/wav", "audio/x-wav", "audio/webm", "audio/mpeg3",
    "audio/flac", "audio/ogg"
}

# Global model instance
_model_instance = None

@lru_cache(maxsize=1)
def load_model():
    """
    Load the Indic Conformer model. Uses caching to ensure model is loaded only once.
    
    Returns:
        AutoModel: The loaded Indic Conformer model
    """
    global _model_instance
    if _model_instance is None:
        try:
            logger.info("Loading Indic Conformer model...")
            _model_instance = AutoModel.from_pretrained(
                "ai4bharat/indic-conformer-600m-multilingual", 
                trust_remote_code=True
            )
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")
    
    return _model_instance

def preprocess_audio(audio_bytes: bytes, target_sample_rate: int = 16000) -> torch.Tensor:
    """
    Preprocess audio data for the model.
    
    Args:
        audio_bytes (bytes): Raw audio file bytes
        target_sample_rate (int): Target sample rate for the model
        
    Returns:
        torch.Tensor: Preprocessed audio tensor
    """
    try:
        # Save bytes to temporary file for torchaudio to load
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            temp_file.write(audio_bytes)
            temp_file_path = temp_file.name
        
        try:
            # Load audio using torchaudio
            wav, sr = torchaudio.load(temp_file_path)
            
            # Convert to mono if stereo
            if wav.shape[0] > 1:
                wav = torch.mean(wav, dim=0, keepdim=True)
            
            # Resample if necessary
            if sr != target_sample_rate:
                resampler = torchaudio.transforms.Resample(
                    orig_freq=sr, 
                    new_freq=target_sample_rate
                )
                wav = resampler(wav)
            
            return wav
            
        finally:
            # Clean up temporary file
            os.unlink(temp_file_path)
            
    except Exception as e:
        logger.error(f"Error preprocessing audio: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error processing audio file: {str(e)}")

async def transcribe_with_model(wav: torch.Tensor, language: str = "hi", 
                              decoding_method: str = "ctc") -> str:
    """
    Perform transcription using the Indic Conformer model.
    
    Args:
        wav (torch.Tensor): Preprocessed audio tensor
        language (str): Language code for transcription
        decoding_method (str): Decoding method - 'ctc' or 'rnnt'
        
    Returns:
        str: Transcribed text
    """
    try:
        model = load_model()
        
        # Run transcription in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        transcription = await loop.run_in_executor(
            None, 
            lambda: model(wav, language, decoding_method)
        )
        
        return transcription
        
    except Exception as e:
        logger.error(f"Error during transcription: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@router.post("/transcribe/audio")
async def transcribe_audio(
    audio_file: UploadFile = File(...),
    language: str = "hi",
    decoding_method: str = "ctc"
):
    """
    Transcribe an audio file to text using the Indic Conformer model.

    Args:
        audio_file (UploadFile): The audio file to transcribe.
        Supported formats: mp3, mp4, mpeg, mpga, m4a, wav, webm, flac, ogg.
        language (str): Language code for transcription (default: "hi" for Hindi).
        decoding_method (str): Decoding method - 'ctc' or 'rnnt' (default: "ctc").

    Returns:
        dict: A dictionary containing the transcribed text and metadata.
    """
    # Validate audio file format
    if not audio_file.content_type or audio_file.content_type not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type. Supported formats: {', '.join([fmt.split('/')[-1] for fmt in SUPPORTED_FORMATS])}"
        )

    # Validate decoding method
    if decoding_method not in ["ctc", "rnnt"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid decoding method. Supported methods: 'ctc', 'rnnt'"
        )

    try:
        logger.info(f"Processing audio file: {audio_file.filename}")
        
        # Read audio file
        audio_bytes = await audio_file.read()
        
        if len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file")
        
        # Preprocess audio
        logger.info("Preprocessing audio...")
        wav_tensor = preprocess_audio(audio_bytes)
        
        # Perform transcription
        logger.info(f"Transcribing with {decoding_method} decoding...")
        transcription = await transcribe_with_model(wav_tensor, language, decoding_method)
        
        if transcription and transcription.strip():
            logger.info("Transcription successful")
            return {
                "transcribed_text": transcription,
                "language": language,
                "decoding_method": decoding_method,
                "filename": audio_file.filename
            }
        else:
            raise HTTPException(status_code=400, detail="Transcription failed: No text returned")

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error transcribing audio: {str(e)}")

@router.get("/transcribe/supported-languages")
async def get_supported_languages():
    """
    Get list of supported languages for the Indic Conformer model.
    
    Returns:
        dict: Dictionary containing supported languages
    """
    # Common languages supported by the Indic Conformer model
    supported_languages = {
        "hi": "Hindi",
        "bn": "Bengali", 
        "te": "Telugu",
        "mr": "Marathi",
        "ta": "Tamil",
        "gu": "Gujarati",
        "kn": "Kannada",
        "ml": "Malayalam",
        "pa": "Punjabi",
        "or": "Odia",
        "as": "Assamese",
        "ur": "Urdu",
        "en": "English"
    }
    
    return {
        "supported_languages": supported_languages,
        "default_language": "hi"
    }

@router.get("/transcribe/health")
async def health_check():
    """
    Health check endpoint to verify model availability.
    
    Returns:
        dict: Health status
    """
    try:
        model = load_model()
        return {
            "status": "healthy",
            "model_loaded": model is not None,
            "message": "Transcription service is operational"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "model_loaded": False,
            "error": str(e)
        }