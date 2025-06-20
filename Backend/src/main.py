import sys
import os

# Add the root directory to Python path to enable proper imports
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import torch
from transformers import BitsAndBytesConfig, AutoProcessor, AutoModelForSpeechSeq2Seq
from .api.transcription import router as transcription_router
from .api.speaker_recognition import router as recognition_router
from .api.sentiment_analysis import router as sentiment_router
from .api.langchain import router as langchain_router


app = FastAPI(
    title="TherapEase API",
    description="API for Therapease application",
    version="0.1.0",
)

# Include the speech-to-text router
app.include_router(recognition_router, prefix="/speech")
app.include_router(transcription_router, prefix="/speech")
app.include_router(sentiment_router, prefix="/speech")
app.include_router(langchain_router, prefix="/langchain")

# config middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",  # List of allowed origins
    allow_credentials=True, # Allow cookies to be included in cross-origin requests
    allow_methods=["*"],    # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],    # Allow all headers to be sent in cross-origin requests
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Therapease API"}

if __name__ == "__main__":
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)