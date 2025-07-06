# apps/patient_history/models.py
from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class MoodEntry(models.Model):
    MOOD_TYPES = [
        ('very_sad', 'Very Sad'),
        ('sad', 'Sad'),
        ('neutral', 'Neutral'),
        ('happy', 'Happy'),
        ('very_happy', 'Very Happy'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mood_entries')
    mood = models.CharField(max_length=20, choices=MOOD_TYPES)
    mood_score = models.IntegerField()  # 1-10 scale
    notes = models.TextField(blank=True, null=True)
    energy_level = models.IntegerField(blank=True, null=True)  # 1-10 scale
    sleep_quality = models.IntegerField(blank=True, null=True)  # 1-10 scale
    anxiety_level = models.IntegerField(blank=True, null=True)  # 1-10 scale
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'mood_entries'
        ordering = ['-created_at']

class ReflectionPrompt(models.Model):
    PROMPT_TYPES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('session_based', 'Session Based'),
        ('custom', 'Custom'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    therapist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reflection_prompts')
    prompt_text = models.TextField()
    prompt_type = models.CharField(max_length=20, choices=PROMPT_TYPES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reflection_prompts'

class ReflectionEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reflection_entries')
    prompt = models.ForeignKey(ReflectionPrompt, on_delete=models.CASCADE, related_name='entries')
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reflection_entries'
        ordering = ['-created_at']

class PatientGoal(models.Model):
    GOAL_STATUS = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('paused', 'Paused'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='goals')
    therapist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_goals')
    title = models.CharField(max_length=200)
    description = models.TextField()
    target_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=GOAL_STATUS, default='active')
    progress_percentage = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'patient_goals'

class ProgressTracking(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress_tracking')
    date = models.DateField()
    overall_wellbeing = models.IntegerField(blank=True, null=True)  # 1-10 scale
    symptom_severity = models.IntegerField(blank=True, null=True)  # 1-10 scale
    functional_improvement = models.IntegerField(blank=True, null=True)  # 1-10 scale
    medication_adherence = models.IntegerField(blank=True, null=True)  # 1-10 scale
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'progress_tracking'
        unique_together = ['patient', 'date']
