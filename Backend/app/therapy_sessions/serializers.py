from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Session, SessionTemplate, PatientProgress, SessionReminder,
    TherapistAvailability, SessionQRCode, SessionAudio, SessionInsight,
    PatientPairingRequest
)
from users.models import PatientProfile, TherapistProfile

User = get_user_model()


class PatientBasicSerializer(serializers.ModelSerializer):
    """Basic patient information for session displays"""
    full_name = serializers.ReadOnlyField()
    patient_id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone_number', 'patient_id']
    
    def get_patient_id(self, obj):
        try:
            return obj.patient_profile.patient_id
        except:
            return None


class TherapistBasicSerializer(serializers.ModelSerializer):
    """Basic therapist information for session displays"""
    full_name = serializers.ReadOnlyField()
    specialization = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'specialization']
    
    def get_specialization(self, obj):
        try:
            return obj.therapist_profile.specialization
        except:
            return None


class SessionSerializer(serializers.ModelSerializer):
    """Full session serializer for display"""
    patient = PatientBasicSerializer(read_only=True)
    therapist = TherapistBasicSerializer(read_only=True)
    actual_duration_minutes = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    mood_improvement = serializers.ReadOnlyField()
    
    class Meta:
        model = Session
        fields = [
            'id', 'patient', 'therapist', 'session_number', 'session_type',
            'is_quick_session', 'quick_session_patient_name', 'transcription_id',
            'scheduled_date', 'actual_start_time', 'actual_end_time',
            'duration_minutes', 'actual_duration_minutes', 'status', 'location',
            'is_online', 'session_notes', 'patient_goals', 'homework_assigned',
            'next_session_goals', 'patient_mood_before', 'patient_mood_after',
            'mood_improvement', 'therapist_observations', 'session_effectiveness',
            'consent_recording', 'consent_ai_analysis', 'fee_charged',
            'payment_status', 'ai_mood_analysis', 'ai_key_topics', 
            'ai_sentiment_score', 'ai_recommendations', 'is_overdue', 
            'created_at', 'updated_at'
        ]


class SessionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new sessions"""
    patient_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    quick_session_patient_name = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Session
        fields = [
            'patient_id', 'quick_session_patient_name', 'session_type', 'scheduled_date', 
            'duration_minutes', 'location', 'is_online', 'patient_goals', 'fee_charged',
            'consent_recording', 'consent_ai_analysis'
        ]
    
    def validate(self, attrs):
        """Validate that either patient_id or quick_session_patient_name is provided"""
        patient_id = attrs.get('patient_id')
        quick_session_patient_name = attrs.get('quick_session_patient_name')
        
        if not patient_id and not quick_session_patient_name:
            raise serializers.ValidationError(
                "Either patient_id or quick_session_patient_name must be provided."
            )
        
        return attrs
    
    def validate_patient_id(self, value):
        """Validate that patient exists and is connected to therapist"""
        if value is None:
            return value
            
        try:
            patient = User.objects.get(id=value, user_type='patient')
            # Check if patient is connected to the therapist
            therapist = self.context['request'].user
            if not hasattr(patient, 'patient_profile') or not patient.patient_profile.therapist or patient.patient_profile.therapist.user != therapist:
                raise serializers.ValidationError("Patient is not connected to this therapist.")
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("Patient not found.")
    
    def create(self, validated_data):
        patient_id = validated_data.pop('patient_id', None)
        quick_session_patient_name = validated_data.get('quick_session_patient_name')
        
        if patient_id:
            # Regular session with assigned patient
            patient = User.objects.get(id=patient_id)
            validated_data['patient'] = patient
            validated_data['is_quick_session'] = False
        else:
            # Quick session without assigned patient
            validated_data['patient'] = None
            validated_data['is_quick_session'] = True
            
        return super().create(validated_data)


class SessionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating sessions"""
    
    class Meta:
        model = Session
        fields = [
            'session_type', 'scheduled_date', 'duration_minutes', 'status',
            'location', 'is_online', 'session_notes', 'patient_goals',
            'homework_assigned', 'next_session_goals', 'patient_mood_before',
            'patient_mood_after', 'therapist_observations', 'session_effectiveness',
            'consent_recording', 'consent_ai_analysis', 'fee_charged', 'payment_status'
        ]


class PatientListSerializer(serializers.ModelSerializer):
    """Serializer for listing patients"""
    full_name = serializers.ReadOnlyField()
    patient_profile = serializers.SerializerMethodField()
    last_session = serializers.SerializerMethodField()
    next_session = serializers.SerializerMethodField()
    total_sessions = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'full_name', 'email', 'phone_number', 'date_of_birth',
            'gender', 'patient_profile', 'last_session', 'next_session',
            'total_sessions', 'created_at'
        ]
    
    def get_patient_profile(self, obj):
        try:
            profile = obj.patient_profile
            return {
                'patient_id': profile.patient_id,
                'primary_concern': profile.primary_concern,
                'therapy_start_date': profile.therapy_start_date,
                'session_frequency': profile.session_frequency,
                'preferred_session_days': profile.get_preferred_days_list(),
                'emergency_contact_name': profile.emergency_contact_name,
                'emergency_contact_phone': profile.emergency_contact_phone,
                'preferred_language': profile.preferred_language,
                'connected_at': profile.connected_at,
            }
        except:
            return None
    
    def get_last_session(self, obj):
        last_session = Session.objects.filter(
            patient=obj, status='completed'
        ).order_by('-scheduled_date').first()
        
        if last_session:
            return {
                'id': last_session.id,
                'date': last_session.scheduled_date,
                'session_number': last_session.session_number,
                'mood_improvement': last_session.mood_improvement,
            }
        return None
    
    def get_next_session(self, obj):
        from django.utils import timezone
        next_session = Session.objects.filter(
            patient=obj, status='scheduled',
            scheduled_date__gte=timezone.now()
        ).order_by('scheduled_date').first()
        
        if next_session:
            return {
                'id': next_session.id,
                'date': next_session.scheduled_date,
                'session_number': next_session.session_number,
                'location': next_session.location,
                'is_online': next_session.is_online,
            }
        return None
    
    def get_total_sessions(self, obj):
        return Session.objects.filter(patient=obj).count()


class SessionTemplateSerializer(serializers.ModelSerializer):
    """Serializer for session templates"""
    patient = PatientBasicSerializer(read_only=True)
    patient_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = SessionTemplate
        fields = [
            'id', 'patient', 'patient_id', 'name', 'session_type',
            'duration_minutes', 'location', 'is_online', 'is_recurring',
            'recurrence_pattern', 'default_goals', 'default_notes_template',
            'is_active', 'created_at', 'updated_at'
        ]
    
    def validate_patient_id(self, value):
        """Validate that patient exists and is connected to therapist"""
        try:
            patient = User.objects.get(id=value, user_type='patient')
            therapist = self.context['request'].user
            if not patient.patient_profile.therapist or patient.patient_profile.therapist.user != therapist:
                raise serializers.ValidationError("Patient is not connected to this therapist.")
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("Patient not found.")
    
    def create(self, validated_data):
        patient_id = validated_data.pop('patient_id')
        patient = User.objects.get(id=patient_id)
        validated_data['patient'] = patient
        validated_data['therapist'] = self.context['request'].user
        return super().create(validated_data)


class PatientProgressSerializer(serializers.ModelSerializer):
    """Serializer for patient progress tracking"""
    patient = PatientBasicSerializer(read_only=True)
    therapist = TherapistBasicSerializer(read_only=True)
    
    class Meta:
        model = PatientProgress
        fields = [
            'id', 'patient', 'therapist', 'overall_progress_rating',
            'mood_trend', 'goals_achieved', 'current_challenges',
            'next_milestones', 'assessment_date', 'sessions_completed',
            'therapist_notes', 'patient_feedback', 'created_at', 'updated_at'
        ]


class TherapistAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for therapist availability"""
    
    class Meta:
        model = TherapistAvailability
        fields = [
            'id', 'day_of_week', 'start_time', 'end_time', 'is_available',
            'max_sessions', 'session_duration', 'effective_from',
            'effective_until', 'location', 'is_online_available',
            'created_at', 'updated_at'
        ]


class SessionInsightSerializer(serializers.ModelSerializer):
    """Serializer for session insights"""
    session = SessionSerializer(read_only=True)
    
    class Meta:
        model = SessionInsight
        fields = [
            'id', 'session', 'overall_mood', 'mood_score', 'key_themes',
            'emotional_patterns', 'recommendations', 'generated_at'
        ]


class SessionStatsSerializer(serializers.Serializer):
    """Serializer for session statistics"""
    total_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    cancelled_sessions = serializers.IntegerField()
    no_show_sessions = serializers.IntegerField()
    upcoming_sessions = serializers.IntegerField()
    total_patients = serializers.IntegerField()
    average_session_effectiveness = serializers.FloatField()
    sessions_by_status = serializers.ListField()
    sessions_by_type = serializers.ListField()


class SessionReminderSerializer(serializers.ModelSerializer):
    """Serializer for session reminders"""
    session = SessionSerializer(read_only=True)
    
    class Meta:
        model = SessionReminder
        fields = [
            'id', 'session', 'reminder_type', 'send_at', 'hours_before',
            'is_sent', 'sent_at', 'delivery_status', 'custom_message',
            'created_at'
        ]

class PatientPairingRequestSerializer(serializers.ModelSerializer):
    """Serializer for patient pairing requests"""
    patient = PatientBasicSerializer(read_only=True)
    therapist = TherapistBasicSerializer(read_only=True)
    is_expired = serializers.ReadOnlyField()
    
    class Meta:
        model = PatientPairingRequest
        fields = [
            'id', 'patient', 'therapist', 'therapist_pin', 'status',
            'patient_message', 'therapist_response', 'reviewed_at',
            'is_expired', 'created_at', 'expires_at'
        ]
        read_only_fields = ['therapist', 'reviewed_at']