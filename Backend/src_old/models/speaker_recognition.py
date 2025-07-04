
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
            {"speaker": "Doctor", "utterance": "Hello, how are you feeling today?"},
            {"speaker": "Patient", "utterance": "I'm not feeling so good, doctor. I have a cough."},
            {"speaker": "Doctor", "utterance": "Let's take a look."}
        ]
    )
