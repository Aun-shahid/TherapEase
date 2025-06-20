from fastapi import APIRouter, HTTPException, File, UploadFile, status
import os
from groq import Groq
from dotenv import load_dotenv
from ..models.sentiment_analysis import (
    DiarizationResponse, 
    Utterance,
    SentimentData,
    UtteranceWithSentiment,
    SentimentAnalysisResponse
)
from .speaker_recognition import speaker_recognition

router = APIRouter()

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
   raise ValueError("GROQ_API_KEY is not set")

client = Groq(api_key=groq_api_key)

@router.post("/sentiment_analysis/audio")
async def analyze_sentiment(audio_file: UploadFile = File(...)):
    """
    Analyze sentiment in an audio conversation.
    
    First performs speaker recognition, then analyzes the sentiment of each utterance.
    
    Args:
        audio_file (UploadFile): The audio file to analyze
        
    Returns:
        SentimentAnalysisResponse: The sentiment analysis results for the conversation
    """
    # First get the speaker diarization
    diarization = await speaker_recognition(audio_file)
    
    # Now analyze sentiment for each utterance
    conversation_with_sentiment = []
    
    for utterance in diarization.diarized_conversation:
        # Use Groq's Mixtral model for more nuanced sentiment analysis
        prompt = f"""
        Analyze the emotional content and therapeutic significance of the following utterance:
        
        Speaker: {utterance.speaker}
        Utterance: {utterance.utterance}
        
        Return a JSON object with these fields:
        - primary_emotion: The dominant emotion expressed (e.g., anxiety, joy, sadness, anger, fear, neutral)
        - emotion_intensity: A number from 1-5 indicating intensity
        - brief_analysis: A brief interpretation of what this suggests about the speaker's mental state
        - therapeutic_significance: Clinical implications and suggestions (only if speaker is a patient)
        
        Focus on therapeutic context and mental health implications.
        """
        
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert mental health professional specializing in emotional analysis and therapeutic assessment."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="mixtral-8x7b-32768",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        sentiment_data = SentimentData(**response.choices[0].message.content)
        
        conversation_with_sentiment.append(
            UtteranceWithSentiment(
                speaker=utterance.speaker,
                utterance=utterance.utterance,
                sentiment_data=sentiment_data
            )
        )
    
    return SentimentAnalysisResponse(analyzed_conversation=conversation_with_sentiment)