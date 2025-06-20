from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class Utterance(BaseModel):
    """
    Basic structure for a single utterance in the conversation.
    """
    speaker: str = Field(..., description="Speaker label")
    utterance: str = Field(..., description="Utterance text")


class DiarizationResponse(BaseModel):
    """The structured response for speaker diarization."""
    diarized_conversation: List[Utterance] = Field(
        ...,
        description="A list of objects, each representing a speaker's utterance.",
        example=[
            {"speaker": "Therapist", "utterance": "آج آپ کیسا محسوس کر رہے ہیں؟"},
            {"speaker": "Patient", "utterance": "میں بہت پریشان ہوں، پچھلے ہفتے سے نیند نہیں آ رہی۔"},
            {"speaker": "Therapist", "utterance": "مجھے مزید بتائیں۔"}
        ]
    )


class SentimentData(BaseModel):
    """
    Structure for sentiment analysis data for an utterance.
    """
    primary_emotion: str = Field(
        ..., 
        description="The primary emotion detected in the utterance",
        example="anxiety"
    )
    emotion_intensity: int = Field(
        ..., 
        description="Intensity of the emotion on a scale of 1-5",
        ge=1,
        le=5,
        example=4
    )
    brief_analysis: Optional[str] = Field(
        None, 
        description="Brief analysis of what this emotion suggests about mental state",
        example="Patient shows significant sleep disturbance, likely related to persistent anxiety. The language suggests this has been an ongoing issue rather than a recent development."
    )
    therapeutic_significance: Optional[str] = Field(
        None, 
        description="Potential clinical significance of this emotional state",
        example="Sleep disturbance combined with anxiety may indicate generalized anxiety disorder or depression. Consider exploring stressors and sleep hygiene."
    )


class UtteranceWithSentiment(BaseModel):
    """
    Structure for an utterance with sentiment analysis.
    """
    speaker: str = Field(..., description="Speaker label")
    utterance: str = Field(..., description="Utterance text")
    sentiment_data: SentimentData = Field(
        ...,
        description="Sentiment analysis data for this utterance"
    )


class SentimentAnalysisResponse(BaseModel):
    """
    The structured response for sentiment analysis.
    """
    analyzed_conversation: List[UtteranceWithSentiment] = Field(
        ...,
        description="A list of objects, each representing a speaker's utterance with sentiment analysis.",
        example=[
            {
                "speaker": "Therapist", 
                "utterance": "آج آپ کیسا محسوس کر رہے ہیں؟",
                "sentiment_data": {
                    "primary_emotion": "neutral",
                    "emotion_intensity": 1,
                    "brief_analysis": None,
                    "therapeutic_significance": None
                }
            },
            {
                "speaker": "Patient", 
                "utterance": "میں بہت پریشان ہوں، پچھلے ہفتے سے نیند نہیں آ رہی۔",
                "sentiment_data": {
                    "primary_emotion": "anxiety",
                    "emotion_intensity": 4,
                    "brief_analysis": "Patient shows significant sleep disturbance, likely related to persistent anxiety. The language suggests this has been an ongoing issue rather than a recent development.",
                    "therapeutic_significance": "Sleep disturbance combined with anxiety may indicate generalized anxiety disorder or depression. Consider exploring stressors and sleep hygiene."
                }
            }
        ]
    )