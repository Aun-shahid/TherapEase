from django.urls import path
from .views import (
    TherapistSessionsView, SessionDetailView, TherapistPatientsView,
    CreatePatientView, StartSessionView, EndSessionView, SessionStatsView,
    PatientSessionsView, UpcomingSessionsView, PairPatientView,
    PatientDashboardView, TherapistDashboardView, SessionNotesView,
    PatientPairingRequestsView, ApprovePairingView, AssignPatientToSessionView,
    PastSessionsView
)

urlpatterns = [
    # Session management
    path('sessions/', TherapistSessionsView.as_view(), name='therapist_sessions'),
    path('sessions/<uuid:pk>/', SessionDetailView.as_view(), name='session_detail'),
    path('sessions/<uuid:session_id>/start/', StartSessionView.as_view(), name='start_session'),
    path('sessions/<uuid:session_id>/end/', EndSessionView.as_view(), name='end_session'),
    path('sessions/<uuid:session_id>/notes/', SessionNotesView.as_view(), name='session_notes'),
    path('sessions/<uuid:session_id>/assign-patient/', AssignPatientToSessionView.as_view(), name='assign_patient_to_session'),
    path('sessions/past/', PastSessionsView.as_view(), name='past_sessions'),
    
    # Patient management
    path('patients/', TherapistPatientsView.as_view(), name='therapist_patients'),
    path('patients/create/', CreatePatientView.as_view(), name='create_patient'),
    path('patients/pair/', PairPatientView.as_view(), name='pair_patient'),
    path('patients/pairing-requests/', PatientPairingRequestsView.as_view(), name='pairing_requests'),
    path('patients/pairing-requests/<uuid:request_id>/approve/', ApprovePairingView.as_view(), name='approve_pairing'),
    
    # Dashboard views
    path('dashboard/therapist/', TherapistDashboardView.as_view(), name='therapist_dashboard'),
    path('dashboard/patient/', PatientDashboardView.as_view(), name='patient_dashboard'),
    
    # Statistics and insights
    path('stats/', SessionStatsView.as_view(), name='session_stats'),
    path('upcoming/', UpcomingSessionsView.as_view(), name='upcoming_sessions'),
    
    # Patient views
    path('my-sessions/', PatientSessionsView.as_view(), name='patient_sessions'),
]