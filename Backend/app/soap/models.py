# apps/soap_notes/models.py
from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class SOAPNote(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('completed', 'Completed'),
        ('reviewed', 'Reviewed'),
        ('archived', 'Archived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='soap_notes')
    therapist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_soap_notes')
    sessions = models.ManyToManyField('sessions.Session', related_name='soap_notes')
    
    # SOAP Components
    subjective = models.TextField(blank=True, null=True)
    objective = models.TextField(blank=True, null=True)
    assessment = models.TextField(blank=True, null=True)
    plan = models.TextField(blank=True, null=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'soap_notes'
        ordering = ['-created_at']

class SOAPNoteVersion(models.Model):
    soap_note = models.ForeignKey(SOAPNote, on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField()
    subjective = models.TextField(blank=True, null=True)
    objective = models.TextField(blank=True, null=True)
    assessment = models.TextField(blank=True, null=True)
    plan = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    change_summary = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'soap_note_versions'
        unique_together = ['soap_note', 'version_number']

class SOAPTemplate(models.Model):
    therapist = models.ForeignKey(User, on_delete=models.CASCADE, related_name='soap_templates')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    subjective_template = models.TextField(blank=True, null=True)
    objective_template = models.TextField(blank=True, null=True)
    assessment_template = models.TextField(blank=True, null=True)
    plan_template = models.TextField(blank=True, null=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'soap_templates'
