from pydantic import BaseModel, Field
from typing import List, Optional
from .sentiment_analysis import UtteranceWithSentiment

class SOAPNotes(BaseModel):
    """SOAP notes model."""
    subjective: str = Field(
        ..., 
        description="Patient's symptoms, complaints, and expressed concerns"
    )
    objective: str = Field(
        ..., 
        description="Observable data, including patient behavior and responses"
    )
    assessment: str = Field(
        ..., 
        description="Therapist's analysis and interpretation of the situation"
    )
    plan: str = Field(
        ..., 
        description="Treatment plan and next steps"
    )
    conversation: List[UtteranceWithSentiment] = Field(
        ...,
        description="The analyzed conversation with sentiment that led to these notes"
    )
