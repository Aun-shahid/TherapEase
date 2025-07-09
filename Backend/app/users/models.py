from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid
import random

class User(AbstractUser):
    USER_TYPES = [
        ('patient', 'Patient'),
        ('therapist', 'Therapist'),
        ('admin', 'Admin'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)  # Add unique=True
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='patient')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    email_verified = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    therapist = models.ForeignKey('TherapistProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='patients')
    connected_at = models.DateTimeField(null=True, blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    current_medications = models.TextField(blank=True, null=True)
    preferred_language = models.CharField(max_length=10, choices=[('en', 'English'), ('ur', 'Urdu')], default='en')
    
    class Meta:
        db_table = 'patient_profiles'

class TherapistProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='therapist_profile')
    license_number = models.CharField(max_length=100, unique=True)
    specialization = models.CharField(max_length=200)
    years_of_experience = models.IntegerField(default=0)
    education = models.TextField(blank=True, null=True)
    certifications = models.TextField(blank=True, null=True)
    clinic_name = models.CharField(max_length=200, blank=True, null=True)
    clinic_address = models.TextField(blank=True, null=True)
    therapist_pin = models.CharField(max_length=9, unique=True, blank=True, null=True)
    
    def generate_unique_pin(self):
        """Generate a unique 9-digit PIN for the therapist"""
        while True:
            # Generate a 9-digit PIN
            pin = str(random.randint(100000000, 999999999))
            # Check if this PIN already exists
            if not TherapistProfile.objects.filter(therapist_pin=pin).exists():
                return pin
    
    def save(self, *args, **kwargs):
        # Generate PIN only if it doesn't exist
        if not self.therapist_pin:
            self.therapist_pin = self.generate_unique_pin()
        super().save(*args, **kwargs)
    
    def get_connected_patients(self):
        """Get all patients connected to this therapist"""
        return self.patients.all()
    
    def get_patient_count(self):
        """Get the number of patients connected to this therapist"""
        return self.patients.count()
    
    class Meta:
        db_table = 'therapist_profiles'