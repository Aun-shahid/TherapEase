from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Q, Count, Avg
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample, OpenApiParameter
from datetime import datetime, timedelta
import json

from .models import (
    Session, SessionTemplate, PatientProgress, SessionReminder, 
    TherapistAvailability, SessionQRCode, SessionAudio, SessionInsight,
    PatientPairingRequest
)
from .serializers import (
    SessionSerializer, SessionCreateSerializer, SessionUpdateSerializer,
    SessionTemplateSerializer, PatientProgressSerializer, 
    TherapistAvailabilitySerializer, SessionInsightSerializer,
    PatientListSerializer, SessionStatsSerializer, PatientPairingRequestSerializer
)
from users.models import PatientProfile, TherapistProfile

User = get_user_model()


@extend_schema(
    tags=['Therapy Sessions'],
    summary="List or create therapy sessions",
    description="Get all sessions for the authenticated therapist or create a new session. Supports both regular sessions with assigned patients and quick sessions with just patient names.",
    parameters=[
        OpenApiParameter(name='status', description='Filter by session status', required=False, type=str),
        OpenApiParameter(name='start_date', description='Filter sessions from this date (YYYY-MM-DD)', required=False, type=str),
        OpenApiParameter(name='end_date', description='Filter sessions until this date (YYYY-MM-DD)', required=False, type=str),
        OpenApiParameter(name='patient_id', description='Filter sessions for specific patient', required=False, type=str),
    ],
    examples=[
        OpenApiExample(
            'Regular Session Creation',
            summary='Create session with assigned patient',
            description='Create a session with a patient that is already connected to the therapist',
            value={
                "patient_id": "123e4567-e89b-12d3-a456-426614174000",
                "session_type": "individual",
                "scheduled_date": "2024-01-15T10:00:00Z",
                "duration_minutes": 60,
                "location": "Clinic Room 1",
                "is_online": False,
                "patient_goals": "Work on anxiety management techniques",
                "fee_charged": 150.00,
                "consent_recording": True,
                "consent_ai_analysis": True
            },
            request_only=True,
        ),
        OpenApiExample(
            'Quick Session Creation',
            summary='Create quick session without assigned patient',
            description='Create a quick session with just patient name for immediate therapy sessions',
            value={
                "quick_session_patient_name": "John Doe",
                "session_type": "individual",
                "scheduled_date": "2024-01-15T10:00:00Z",
                "duration_minutes": 60,
                "location": "Clinic Room 1",
                "is_online": False,
                "patient_goals": "Emergency session for anxiety",
                "consent_recording": True,
                "consent_ai_analysis": True
            },
            request_only=True,
        ),
    ]
)
class TherapistSessionsView(generics.ListCreateAPIView):
    """List all sessions for a therapist or create a new session"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SessionCreateSerializer
        return SessionSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'therapist':
            return Session.objects.none()
        
        queryset = Session.objects.filter(therapist=user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            queryset = queryset.filter(scheduled_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(scheduled_date__lte=end_date)
        
        # Filter by patient
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            queryset = queryset.filter(patient__id=patient_id)
        
        return queryset.select_related('patient', 'therapist').order_by('-scheduled_date')
    
    def perform_create(self, serializer):
        serializer.save(therapist=self.request.user, created_by=self.request.user)


@extend_schema(
    tags=['Therapy Sessions'],
    summary="Session details",
    description="Retrieve, update or delete a specific therapy session",
    examples=[
        OpenApiExample(
            'Session Update',
            summary='Update session details',
            description='Update session information including notes and patient mood',
            value={
                "session_notes": "Patient showed significant improvement in anxiety levels. Discussed coping strategies.",
                "patient_mood_before": 4,
                "patient_mood_after": 7,
                "homework_assigned": "Practice breathing exercises daily for 10 minutes",
                "next_session_goals": "Continue working on anxiety management, introduce mindfulness techniques",
                "session_effectiveness": 8,
                "therapist_observations": "Patient was more engaged and responsive today"
            },
            request_only=True,
        ),
    ]
)
class SessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a specific session"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return SessionUpdateSerializer
        return SessionSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'therapist':
            return Session.objects.filter(therapist=user)
        elif user.user_type == 'patient':
            return Session.objects.filter(patient=user)
        return Session.objects.none()


@extend_schema(
    tags=['Patient Management'],
    summary="List therapist's patients",
    description="Get all patients connected to the authenticated therapist with their session history and profile information",
)
class TherapistPatientsView(generics.ListAPIView):
    """List all patients for a therapist"""
    serializer_class = PatientListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'therapist':
            return User.objects.none()
        
        try:
            therapist_profile = user.therapist_profile
            # Get all patients connected to this therapist
            patient_profiles = therapist_profile.patients.all()
            patient_users = [profile.user for profile in patient_profiles]
            return patient_users
        except TherapistProfile.DoesNotExist:
            return User.objects.none()


@extend_schema(
    tags=['Patient Management'],
    summary="Create new patient",
    description="Create a new patient and assign to the authenticated therapist",
    examples=[
        OpenApiExample(
            'Create Patient',
            summary='Create a new patient profile',
            description='Create a comprehensive patient profile with all required information',
            value={
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "phone_number": "+1234567890",
                "date_of_birth": "1990-01-15",
                "gender": "male",
                "primary_concern": "Anxiety and stress management",
                "therapy_start_date": "2024-01-01",
                "session_frequency": "weekly",
                "preferred_session_days": ["monday", "wednesday", "friday"],
                "emergency_contact_name": "Jane Doe",
                "emergency_contact_phone": "+1234567891",
                "medical_history": "No significant medical history",
                "current_medications": "None",
                "preferred_language": "en"
            },
            request_only=True,
        ),
    ]
)
class CreatePatientView(APIView):
    """Create a new patient and assign to therapist"""
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        user = request.user
        if user.user_type != 'therapist':
            return Response(
                {'detail': 'Only therapists can create patients.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            therapist_profile = user.therapist_profile
            
            # Check if therapist can accept new patients
            if not therapist_profile.can_accept_new_patients():
                return Response(
                    {'detail': 'Maximum patient limit reached.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            data = request.data
            
            # Prepare user data
            user_data = {
                'username': data.get('email'),  # Use email as username
                'email': data.get('email'),
                'first_name': data.get('first_name', ''),
                'last_name': data.get('last_name', ''),
                'phone_number': data.get('phone_number', ''),
                'date_of_birth': data.get('date_of_birth'),
                'gender': data.get('gender'),
                'user_type': 'patient',
                'password': User.objects.make_random_password(),  # Generate random password
            }
            
            # Prepare patient profile data
            patient_data = {
                'primary_concern': data.get('primary_concern', ''),
                'therapy_start_date': data.get('therapy_start_date'),
                'session_frequency': data.get('session_frequency', 'weekly'),
                'emergency_contact_name': data.get('emergency_contact_name', ''),
                'emergency_contact_phone': data.get('emergency_contact_phone', ''),
                'medical_history': data.get('medical_history', ''),
                'current_medications': data.get('current_medications', ''),
                'preferred_language': data.get('preferred_language', 'en'),
            }
            
            # Handle preferred session days
            preferred_days = data.get('preferred_session_days', [])
            if preferred_days:
                patient_data['preferred_session_days'] = ','.join(preferred_days)
            
            # Create patient
            patient_profile = therapist_profile.create_patient(user_data, patient_data)
            
            # Serialize response
            serializer = PatientListSerializer(patient_profile.user)
            
            return Response({
                'patient': serializer.data,
                'message': 'Patient created successfully.',
                'patient_id': patient_profile.patient_id,
                'temporary_password': user_data['password']  # Send this securely in production
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'detail': f'Error creating patient: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


@extend_schema(
    tags=['Therapy Sessions'],
    summary="Start therapy session",
    description="Start a scheduled therapy session. Changes status from 'scheduled' to 'in_progress' and records actual start time.",
    examples=[
        OpenApiExample(
            'Start Session Response',
            summary='Successful session start',
            description='Response when session is successfully started',
            value={
                "detail": "Session started successfully.",
                "session": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "status": "in_progress",
                    "actual_start_time": "2024-01-15T10:05:00Z"
                }
            },
            response_only=True,
        ),
    ]
)
class StartSessionView(APIView):
    """Start a session"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, session_id):
        user = request.user
        if user.user_type != 'therapist':
            return Response(
                {'detail': 'Only therapists can start sessions.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        session = get_object_or_404(Session, id=session_id, therapist=user)
        
        if session.status != 'scheduled':
            return Response(
                {'detail': 'Session cannot be started. Current status: ' + session.status}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session.start_session()
        
        return Response({
            'detail': 'Session started successfully.',
            'session': SessionSerializer(session).data
        }, status=status.HTTP_200_OK)


class EndSessionView(APIView):
    """End a session"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, session_id):
        user = request.user
        if user.user_type != 'therapist':
            return Response(
                {'detail': 'Only therapists can end sessions.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        session = get_object_or_404(Session, id=session_id, therapist=user)
        
        if session.status != 'in_progress':
            return Response(
                {'detail': 'Session is not in progress.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update session with end data
        data = request.data
        if 'session_notes' in data:
            session.session_notes = data['session_notes']
        if 'patient_mood_after' in data:
            session.patient_mood_after = data['patient_mood_after']
        if 'homework_assigned' in data:
            session.homework_assigned = data['homework_assigned']
        if 'next_session_goals' in data:
            session.next_session_goals = data['next_session_goals']
        if 'session_effectiveness' in data:
            session.session_effectiveness = data['session_effectiveness']
        
        session.end_session()
        
        return Response({
            'detail': 'Session ended successfully.',
            'session': SessionSerializer(session).data
        }, status=status.HTTP_200_OK)


class SessionStatsView(APIView):
    """Get session statistics for therapist"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.user_type != 'therapist':
            return Response(
                {'detail': 'Only therapists can access session stats.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Get date range from query params
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        sessions = Session.objects.filter(
            therapist=user,
            scheduled_date__gte=start_date
        )
        
        stats = {
            'total_sessions': sessions.count(),
            'completed_sessions': sessions.filter(status='completed').count(),
            'cancelled_sessions': sessions.filter(status='cancelled').count(),
            'no_show_sessions': sessions.filter(status='no_show').count(),
            'upcoming_sessions': sessions.filter(
                status='scheduled',
                scheduled_date__gte=timezone.now()
            ).count(),
            'total_patients': sessions.values('patient').distinct().count(),
            'average_session_effectiveness': sessions.filter(
                session_effectiveness__isnull=False
            ).aggregate(avg=Avg('session_effectiveness'))['avg'],
            'sessions_by_status': list(
                sessions.values('status').annotate(count=Count('id'))
            ),
            'sessions_by_type': list(
                sessions.values('session_type').annotate(count=Count('id'))
            ),
        }
        
        return Response(stats, status=status.HTTP_200_OK)


class PatientSessionsView(generics.ListAPIView):
    """List sessions for a patient"""
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'patient':
            return Session.objects.none()
        
        return Session.objects.filter(patient=user).order_by('-scheduled_date')


class UpcomingSessionsView(generics.ListAPIView):
    """Get upcoming sessions for therapist or patient"""
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        now = timezone.now()
        
        if user.user_type == 'therapist':
            return Session.objects.filter(
                therapist=user,
                status='scheduled',
                scheduled_date__gte=now
            ).order_by('scheduled_date')[:10]
        elif user.user_type == 'patient':
            return Session.objects.filter(
                patient=user,
                status='scheduled',
                scheduled_date__gte=now
            ).order_by('scheduled_date')[:10]
        
        return Session.objects.none()


class PairPatientView(APIView):
    """Pair a patient to therapist using pairing code"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'pairing_code': {'type': 'string', 'description': 'Therapist pairing code'},
                }
            }
        },
        responses={
            200: OpenApiResponse(description='Successfully paired with therapist'),
            400: OpenApiResponse(description='Invalid pairing code or already paired'),
            403: OpenApiResponse(description='Only patients can pair with therapists')
        }
    )
    def post(self, request):
        user = request.user
        if user.user_type != 'patient':
            return Response(
                {'detail': 'Only patients can pair with therapists.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        pairing_code = request.data.get('pairing_code', '').upper()
        if not pairing_code:
            return Response(
                {'detail': 'Pairing code is required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Find therapist with this pairing code
            therapist_profile = TherapistProfile.objects.get(pairing_code=pairing_code)
            
            # Check if therapist can accept new patients
            if not therapist_profile.can_accept_new_patients():
                return Response(
                    {'detail': 'Therapist has reached maximum patient capacity.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get or create patient profile
            patient_profile, created = PatientProfile.objects.get_or_create(
                user=user,
                defaults={
                    'therapist': therapist_profile,
                    'connected_at': timezone.now(),
                }
            )
            
            if not created and patient_profile.therapist:
                return Response(
                    {'detail': 'You are already paired with a therapist.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Pair with therapist
            patient_profile.therapist = therapist_profile
            patient_profile.connected_at = timezone.now()
            patient_profile.save()
            
            return Response({
                'detail': 'Successfully paired with therapist.',
                'therapist': {
                    'name': therapist_profile.user.full_name,
                    'specialization': therapist_profile.specialization,
                    'clinic_name': therapist_profile.clinic_name,
                    'email': therapist_profile.user.email,
                    'phone': therapist_profile.user.phone_number,
                }
            }, status=status.HTTP_200_OK)
            
        except TherapistProfile.DoesNotExist:
            return Response(
                {'detail': 'Invalid pairing code.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class PatientDashboardView(APIView):
    """Get patient dashboard data"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.user_type != 'patient':
            return Response(
                {'detail': 'Only patients can access this endpoint.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            patient_profile = user.patient_profile
            
            # Get upcoming sessions
            upcoming_sessions = Session.objects.filter(
                patient=user,
                status='scheduled',
                scheduled_date__gte=timezone.now()
            ).order_by('scheduled_date')[:3]
            
            # Get recent sessions
            recent_sessions = Session.objects.filter(
                patient=user,
                status='completed'
            ).order_by('-scheduled_date')[:5]
            
            # Calculate stats
            total_sessions = Session.objects.filter(patient=user).count()
            completed_sessions = Session.objects.filter(patient=user, status='completed').count()
            
            # Get mood trend (last 5 completed sessions)
            mood_data = Session.objects.filter(
                patient=user,
                status='completed',
                patient_mood_after__isnull=False
            ).order_by('-scheduled_date')[:5].values_list('patient_mood_after', flat=True)
            
            dashboard_data = {
                'patient_info': {
                    'patient_id': patient_profile.patient_id,
                    'full_name': user.full_name,
                    'email': user.email,
                    'phone_number': user.phone_number,
                    'therapy_start_date': patient_profile.therapy_start_date,
                    'primary_concern': patient_profile.primary_concern,
                    'session_frequency': patient_profile.session_frequency,
                },
                'therapist_info': {
                    'name': patient_profile.therapist.user.full_name if patient_profile.therapist else None,
                    'specialization': patient_profile.therapist.specialization if patient_profile.therapist else None,
                    'clinic_name': patient_profile.therapist.clinic_name if patient_profile.therapist else None,
                    'email': patient_profile.therapist.user.email if patient_profile.therapist else None,
                    'phone': patient_profile.therapist.user.phone_number if patient_profile.therapist else None,
                } if patient_profile.therapist else None,
                'session_stats': {
                    'total_sessions': total_sessions,
                    'completed_sessions': completed_sessions,
                    'upcoming_sessions': upcoming_sessions.count(),
                },
                'upcoming_sessions': SessionSerializer(upcoming_sessions, many=True).data,
                'recent_sessions': SessionSerializer(recent_sessions, many=True).data,
                'mood_trend': list(mood_data),
            }
            
            return Response(dashboard_data, status=status.HTTP_200_OK)
            
        except PatientProfile.DoesNotExist:
            return Response(
                {'detail': 'Patient profile not found.'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class TherapistDashboardView(APIView):
    """Get therapist dashboard data"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        if user.user_type != 'therapist':
            return Response(
                {'detail': 'Only therapists can access this endpoint.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            therapist_profile = user.therapist_profile
            
            # Get today's sessions
            today = timezone.now().date()
            today_sessions = Session.objects.filter(
                therapist=user,
                scheduled_date__date=today
            ).order_by('scheduled_date')
            
            # Get upcoming sessions (next 7 days)
            next_week = timezone.now() + timedelta(days=7)
            upcoming_sessions = Session.objects.filter(
                therapist=user,
                status='scheduled',
                scheduled_date__gte=timezone.now(),
                scheduled_date__lte=next_week
            ).order_by('scheduled_date')
            
            # Get recent patients
            recent_patients = User.objects.filter(
                patient_sessions__therapist=user
            ).distinct().order_by('-patient_sessions__created_at')[:5]
            
            # Calculate stats for last 30 days
            thirty_days_ago = timezone.now() - timedelta(days=30)
            sessions_last_30_days = Session.objects.filter(
                therapist=user,
                scheduled_date__gte=thirty_days_ago
            )
            
            dashboard_data = {
                'therapist_info': {
                    'full_name': user.full_name,
                    'email': user.email,
                    'specialization': therapist_profile.specialization,
                    'license_number': therapist_profile.license_number,
                    'clinic_name': therapist_profile.clinic_name,
                    'therapist_pin': therapist_profile.therapist_pin,
                    'pairing_code': therapist_profile.pairing_code,
                    'years_of_experience': therapist_profile.years_of_experience,
                },
                'patient_stats': {
                    'total_patients': therapist_profile.get_patient_count(),
                    'max_patients': therapist_profile.max_patients,
                    'can_accept_new': therapist_profile.can_accept_new_patients(),
                },
                'session_stats': {
                    'today_sessions': today_sessions.count(),
                    'upcoming_sessions': upcoming_sessions.count(),
                    'total_sessions_30_days': sessions_last_30_days.count(),
                    'completed_sessions_30_days': sessions_last_30_days.filter(status='completed').count(),
                    'cancelled_sessions_30_days': sessions_last_30_days.filter(status='cancelled').count(),
                },
                'today_sessions': SessionSerializer(today_sessions, many=True).data,
                'upcoming_sessions': SessionSerializer(upcoming_sessions[:5], many=True).data,
                'recent_patients': PatientListSerializer(recent_patients, many=True).data,
            }
            
            return Response(dashboard_data, status=status.HTTP_200_OK)
            
        except TherapistProfile.DoesNotExist:
            return Response(
                {'detail': 'Therapist profile not found.'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class SessionNotesView(APIView):
    """Update session notes during or after session"""
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, session_id):
        user = request.user
        if user.user_type != 'therapist':
            return Response(
                {'detail': 'Only therapists can update session notes.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        session = get_object_or_404(Session, id=session_id, therapist=user)
        
        # Update allowed fields
        allowed_fields = [
            'session_notes', 'patient_goals', 'homework_assigned', 
            'next_session_goals', 'therapist_observations',
            'patient_mood_before', 'patient_mood_after', 'session_effectiveness'
        ]
        
        for field in allowed_fields:
            if field in request.data:
                setattr(session, field, request.data[field])
        
        session.save()
        
        return Response({
            'detail': 'Session notes updated successfully.',
            'session': SessionSerializer(session).data
        }, status=status.HTTP_200_OK) 
       
        for field in allowed_fields:
            if field in request.data:
                setattr(session, field, request.data[field])
        
        session.save()
        
        return Response({
            'detail': 'Session notes updated successfully.',
            'session': SessionSerializer(session).data
        }, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Patient Management'],
    summary="Patient pairing requests",
    description="Get pending pairing requests for the authenticated therapist",
)
class PatientPairingRequestsView(generics.ListAPIView):
    """List pending patient pairing requests for therapist"""
    serializer_class = PatientPairingRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'therapist':
            return PatientPairingRequest.objects.none()
        
        return PatientPairingRequest.objects.filter(
            therapist=user,
            status='pending'
        ).order_by('-created_at')


@extend_schema(
    tags=['Patient Management'],
    summary="Approve patient pairing",
    description="Approve a patient pairing request and optionally create new patient profile or connect to existing patient",
    examples=[
        OpenApiExample(
            'Approve with Existing Patient',
            summary='Approve pairing for existing patient',
            description='Approve pairing request and connect patient to therapist',
            value={
                "action": "approve",
                "create_new_patient": False
            },
            request_only=True,
        ),
        OpenApiExample(
            'Approve with New Patient Profile',
            summary='Create new patient profile and approve pairing',
            description='Create comprehensive patient profile and approve pairing',
            value={
                "action": "approve",
                "create_new_patient": True,
                "patient_data": {
                    "primary_concern": "Anxiety and stress management",
                    "therapy_start_date": "2024-01-01",
                    "session_frequency": "weekly",
                    "emergency_contact_name": "Emergency Contact",
                    "emergency_contact_phone": "+1234567890",
                    "medical_history": "No significant medical history",
                    "current_medications": "None",
                    "preferred_language": "en"
                }
            },
            request_only=True,
        ),
    ]
)
class ApprovePairingView(APIView):
    """Approve or reject patient pairing request"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, request_id):
        user = request.user
        if user.user_type != 'therapist':
            return Response(
                {'detail': 'Only therapists can approve pairing requests.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        pairing_request = get_object_or_404(
            PatientPairingRequest, 
            id=request_id, 
            therapist=user,
            status='pending'
        )
        
        action = request.data.get('action')
        
        if action == 'approve':
            create_new_patient = request.data.get('create_new_patient', False)
            patient_data = request.data.get('patient_data', {})
            
            try:
                patient_profile = pairing_request.approve_pairing(
                    create_new_patient=create_new_patient,
                    patient_data=patient_data
                )
                
                return Response({
                    'detail': 'Pairing request approved successfully.',
                    'patient': PatientListSerializer(patient_profile.user).data
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response(
                    {'detail': f'Error approving pairing: {str(e)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        elif action == 'reject':
            reason = request.data.get('reason', '')
            pairing_request.reject_pairing(reason)
            
            return Response({
                'detail': 'Pairing request rejected successfully.'
            }, status=status.HTTP_200_OK)
        
        else:
            return Response(
                {'detail': 'Invalid action. Use "approve" or "reject".'}, 
                status=status.HTTP_400_BAD_REQUEST
            )


@extend_schema(
    tags=['Therapy Sessions'],
    summary="Assign patient to quick session",
    description="Assign a patient to a quick session that was created without a specific patient",
    examples=[
        OpenApiExample(
            'Assign Patient to Session',
            summary='Assign existing patient to quick session',
            description='Convert a quick session to a regular session by assigning a patient',
            value={
                "patient_id": "123e4567-e89b-12d3-a456-426614174000"
            },
            request_only=True,
        ),
    ]
)
class AssignPatientToSessionView(APIView):
    """Assign a patient to a quick session"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, session_id):
        user = request.user
        if user.user_type != 'therapist':
            return Response(
                {'detail': 'Only therapists can assign patients to sessions.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        session = get_object_or_404(Session, id=session_id, therapist=user)
        
        if not session.is_quick_session:
            return Response(
                {'detail': 'This session already has an assigned patient.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        patient_id = request.data.get('patient_id')
        if not patient_id:
            return Response(
                {'detail': 'Patient ID is required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            patient = User.objects.get(id=patient_id, user_type='patient')
            
            # Check if patient is connected to this therapist
            if not hasattr(patient, 'patient_profile') or not patient.patient_profile.therapist or patient.patient_profile.therapist.user != user:
                return Response(
                    {'detail': 'Patient is not connected to this therapist.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Assign patient to session
            session.assign_patient(patient)
            
            return Response({
                'detail': 'Patient assigned to session successfully.',
                'session': SessionSerializer(session).data
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response(
                {'detail': 'Patient not found.'}, 
                status=status.HTTP_404_NOT_FOUND
            )


@extend_schema(
    tags=['Therapy Sessions'],
    summary="Get past sessions",
    description="Get all past sessions for the authenticated therapist with filtering options",
    parameters=[
        OpenApiParameter(name='patient_id', description='Filter by specific patient', required=False, type=str),
        OpenApiParameter(name='limit', description='Limit number of results', required=False, type=int),
        OpenApiParameter(name='offset', description='Offset for pagination', required=False, type=int),
    ],
)
class PastSessionsView(generics.ListAPIView):
    """Get past sessions for therapist"""
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type != 'therapist':
            return Session.objects.none()
        
        queryset = Session.objects.filter(
            therapist=user,
            status__in=['completed', 'cancelled', 'no_show']
        ).order_by('-scheduled_date')
        
        # Filter by patient if specified
        patient_id = self.request.query_params.get('patient_id')
        if patient_id:
            queryset = queryset.filter(patient__id=patient_id)
        
        return queryset


# Add comprehensive OpenAPI documentation to remaining views
@extend_schema(
    tags=['Therapy Sessions'],
    summary="End therapy session",
    description="End an in-progress therapy session and record session completion data",
    examples=[
        OpenApiExample(
            'End Session',
            summary='End session with completion data',
            description='End session and record notes, mood changes, and effectiveness',
            value={
                "session_notes": "Patient showed significant improvement. Discussed coping strategies and assigned homework.",
                "patient_mood_after": 7,
                "homework_assigned": "Practice breathing exercises daily for 10 minutes",
                "next_session_goals": "Continue anxiety management, introduce mindfulness",
                "session_effectiveness": 8
            },
            request_only=True,
        ),
    ]
)
class EndSessionView(APIView):
    pass  # Implementation already exists above


@extend_schema(
    tags=['Analytics'],
    summary="Session statistics",
    description="Get comprehensive session statistics for the authenticated therapist",
    parameters=[
        OpenApiParameter(name='days', description='Number of days to include in statistics (default: 30)', required=False, type=int),
    ],
    examples=[
        OpenApiExample(
            'Session Statistics Response',
            summary='Comprehensive session statistics',
            description='Detailed statistics about therapist sessions',
            value={
                "total_sessions": 45,
                "completed_sessions": 38,
                "cancelled_sessions": 5,
                "no_show_sessions": 2,
                "upcoming_sessions": 12,
                "total_patients": 15,
                "average_session_effectiveness": 7.8,
                "sessions_by_status": [
                    {"status": "completed", "count": 38},
                    {"status": "scheduled", "count": 12},
                    {"status": "cancelled", "count": 5}
                ],
                "sessions_by_type": [
                    {"session_type": "individual", "count": 40},
                    {"session_type": "group", "count": 5}
                ]
            },
            response_only=True,
        ),
    ]
)
class SessionStatsView(APIView):
    pass  # Implementation already exists above


@extend_schema(
    tags=['Patient Dashboard'],
    summary="Patient dashboard",
    description="Get comprehensive dashboard data for the authenticated patient including sessions, therapist info, and progress",
)
class PatientDashboardView(APIView):
    pass  # Implementation already exists above


@extend_schema(
    tags=['Therapist Dashboard'],
    summary="Therapist dashboard",
    description="Get comprehensive dashboard data for the authenticated therapist including today's sessions, patient stats, and analytics",
)
class TherapistDashboardView(APIView):
    pass  # Implementation already exists above


@extend_schema(
    tags=['Patient Management'],
    summary="Patient sessions",
    description="Get all sessions for the authenticated patient",
)
class PatientSessionsView(generics.ListAPIView):
    pass  # Implementation already exists above


@extend_schema(
    tags=['Therapy Sessions'],
    summary="Upcoming sessions",
    description="Get upcoming sessions for the authenticated user (therapist or patient)",
)
class UpcomingSessionsView(generics.ListAPIView):
    pass  # Implementation already exists above


@extend_schema(
    tags=['Patient Management'],
    summary="Pair with therapist",
    description="Pair a patient with a therapist using the therapist's pairing code",
    examples=[
        OpenApiExample(
            'Pair with Therapist',
            summary='Pair patient with therapist using code',
            description='Use therapist pairing code to request connection',
            value={
                "pairing_code": "ABC12345"
            },
            request_only=True,
        ),
    ]
)
class PairPatientView(APIView):
    pass  # Implementation already exists above


@extend_schema(
    tags=['Therapy Sessions'],
    summary="Update session notes",
    description="Update session notes and other session details during or after the session",
    examples=[
        OpenApiExample(
            'Update Session Notes',
            summary='Update session notes and observations',
            description='Update various session fields including notes and patient mood',
            value={
                "session_notes": "Patient was more engaged today. Discussed family relationships.",
                "patient_mood_before": 5,
                "patient_mood_after": 7,
                "therapist_observations": "Noticeable improvement in communication skills",
                "session_effectiveness": 8
            },
            request_only=True,
        ),
    ]
)
class SessionNotesView(APIView):
    pass  # Implementation already exists above