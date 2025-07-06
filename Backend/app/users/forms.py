from django import forms
from django.contrib.auth.forms import UserCreationForm

from .models import User, PatientProfile, TherapistProfile

class UserRegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'first_name', 'last_name', 
                 'user_type', 'phone_number', 'date_of_birth']
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date'}),
            'user_type': forms.Select(choices=User.USER_TYPES),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email is already in use.")
        return email

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Username is already taken.")
        return username

class PatientProfileForm(forms.ModelForm):
    class Meta:
        model = PatientProfile
        fields = ['emergency_contact_name', 'emergency_contact_phone', 
                 'medical_history', 'current_medications', 'preferred_language']
        widgets = {
            'medical_history': forms.Textarea(attrs={'rows': 4}),
            'current_medications': forms.Textarea(attrs={'rows': 4}),
            'preferred_language': forms.Select(choices=[('en', 'English'), ('ur', 'Urdu')]),
        }

class TherapistProfileForm(forms.ModelForm):
    class Meta:
        model = TherapistProfile
        fields = ['license_number', 'specialization', 'years_of_experience',
                 'education', 'certifications', 'clinic_name', 'clinic_address']
        widgets = {
            'education': forms.Textarea(attrs={'rows': 4}),
            'certifications': forms.Textarea(attrs={'rows': 4}),
            'clinic_address': forms.Textarea(attrs={'rows': 3}),
        }

    def clean_license_number(self):
        license_number = self.cleaned_data.get('license_number')
        if TherapistProfile.objects.filter(license_number=license_number).exists():
            raise forms.ValidationError("This license number is already registered.")
        return license_number

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'date_of_birth']
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date'}),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("Email is already in use.")
        return email

