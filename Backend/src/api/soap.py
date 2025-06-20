from fastapi import APIRouter, HTTPException, File, UploadFile, status
import os
from groq import Groq
from dotenv import load_dotenv
from ..models.soap import SOAPNotes
from .sentiment_analysis import analyze_sentiment

router = APIRouter()

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
   raise ValueError("GROQ_API_KEY is not set")

client = Groq(api_key=groq_api_key)

@router.post("/soap/audio")
async def generate_soap_notes(audio_file: UploadFile = File(...)):
    """
    Generate SOAP notes from an audio conversation.
    
    First performs sentiment analysis, then generates structured SOAP notes.
    
    Args:
        audio_file (UploadFile): The audio file to analyze
        
    Returns:
        SOAPNotes: The generated SOAP notes with sentiment analysis
    """
    # First get sentiment analysis results
    sentiment_analysis = await analyze_sentiment(audio_file)
    
    # Format the conversation for the LLM prompt
    conversation_text = "\n\n".join([
        f"Speaker: {utterance.speaker}\n"
        f"Utterance: {utterance.utterance}\n"
        f"Emotion: {utterance.sentiment_data.primary_emotion} "
        f"(Intensity: {utterance.sentiment_data.emotion_intensity}/5)\n"
        f"Analysis: {utterance.sentiment_data.brief_analysis or 'N/A'}\n"
        f"Clinical Note: {utterance.sentiment_data.therapeutic_significance or 'N/A'}"
        for utterance in sentiment_analysis.analyzed_conversation
    ])
    
    # Generate SOAP notes using Groq's Mixtral model
    prompt = f"""
    Based on the following therapy session conversation and sentiment analysis, 
    generate comprehensive SOAP notes. Focus on psychological and emotional aspects.
    
    Session Conversation and Analysis:
    {conversation_text}
    
    Return a JSON object with these fields:
    - subjective: Patient's symptoms, complaints, and expressed concerns from the session
    - objective: Observable data, including patient behavior and emotional responses
    - assessment: Your professional analysis and interpretation of the patient's condition
    - plan: Recommended treatment plan and next steps
    
    Make the notes detailed and clinically relevant, focusing on mental health.
    """
    
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are an experienced mental health professional skilled in creating detailed SOAP notes from therapy sessions."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        model="mixtral-8x7b-32768",
        temperature=0.2,
        response_format={"type": "json_object"}
    )
    
    # Parse response and create SOAPNotes object
    notes_data = response.choices[0].message.content
    
    return SOAPNotes(
        **notes_data,
        conversation=sentiment_analysis.analyzed_conversation
    )