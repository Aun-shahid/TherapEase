# apps/transcription/models.py
from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Transcription(models.Model):
    PROCESSING_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.OneToOneField('sessions.Session', on_delete=models.CASCADE, related_name='transcription')
    status = models.CharField(max_length=20, choices=PROCESSING_STATUS, default='pending')
    language_detected = models.CharField(max_length=10, blank=True, null=True)
    processing_started_at = models.DateTimeField(blank=True, null=True)
    processing_completed_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'transcriptions'

class TranscriptionSegment(models.Model):
    SPEAKER_TYPES = [
        ('patient', 'Patient'),
        ('therapist', 'Therapist'),
        ('unknown', 'Unknown'),
    ]
    
    transcription = models.ForeignKey(Transcription, on_delete=models.CASCADE, related_name='segments')
    speaker_type = models.CharField(max_length=20, choices=SPEAKER_TYPES)
    speaker_id = models.CharField(max_length=50, blank=True, null=True)  # For speaker diarization
    text = models.TextField()
    start_time = models.FloatField()  # in seconds
    end_time = models.FloatField()  # in seconds
    confidence_score = models.FloatField(blank=True, null=True)
    language = models.CharField(max_length=10, blank=True, null=True)
    
    class Meta:
        db_table = 'transcription_segments'
        ordering = ['start_time']

class EmotionAnalysis(models.Model):
    segment = models.OneToOneField(TranscriptionSegment, on_delete=models.CASCADE, related_name='emotion')
    primary_emotion = models.CharField(max_length=50)
    emotion_scores = models.JSONField(default=dict)  # {'happy': 0.8, 'sad': 0.2, etc.}
    valence = models.FloatField()  # -1 to 1 (negative to positive)
    arousal = models.FloatField()  # 0 to 1 (calm to excited)
    confidence = models.FloatField()
    
    class Meta:
        db_table = 'emotion_analysis'
