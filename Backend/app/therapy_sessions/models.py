# apps/sessions/models.py
from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Session(models.Model):
    SESSION_STATUS = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_sessions')
    therapist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='therapist_sessions')
    session_date = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    status = models.CharField(max_length=20, choices=SESSION_STATUS, default='scheduled')
    session_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'sessions'
        ordering = ['-session_date']

class SessionQRCode(models.Model):
    session = models.OneToOneField(Session, on_delete=models.CASCADE, related_name='qr_code')
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'session_qr_codes'

class SessionAudio(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='audio_files')
    file_path = models.FileField(upload_to='session_audio/')
    file_size = models.BigIntegerField()
    duration_seconds = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_processed = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'session_audio'

class SessionInsight(models.Model):
    session = models.OneToOneField(Session, on_delete=models.CASCADE, related_name='insights')
    overall_mood = models.CharField(max_length=50, blank=True, null=True)
    mood_score = models.FloatField(blank=True, null=True)  # 0-10 scale
    key_themes = models.JSONField(default=list)
    emotional_patterns = models.JSONField(default=dict)
    recommendations = models.TextField(blank=True, null=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'session_insights'



