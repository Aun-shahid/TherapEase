from django.urls import path
from .views import (
    PatientHistoryView, HistoryEntryView, HistoryAnalyticsView
)

urlpatterns = [
    # Main history endpoint - handles dashboard, entries, and management
    path('', PatientHistoryView.as_view(), name='patient_history'),
    
    # Individual entry management - handles all entry types
    path('entries/<uuid:pk>/', HistoryEntryView.as_view(), name='history_entry_detail'),
    
    # Analytics and insights
    path('analytics/', HistoryAnalyticsView.as_view(), name='history_analytics'),
]