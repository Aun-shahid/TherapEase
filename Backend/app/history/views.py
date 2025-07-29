from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Avg, Count, Q
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample, OpenApiParameter
from datetime import datetime, timedelta
from collections import defaultdict

from .models import (
    MoodEntry, JournalEntry, ActivityLog, MedicationLog, SleepLog,
    SymptomTracker, CopingStrategy, PatientMilestone, ReflectionPrompt,
    ReflectionEntry, PatientGoal, ProgressTracking
)
from .serializers import (
    MoodEntrySerializer, MoodEntryCreateSerializer, JournalEntrySerializer,
    JournalEntryCreateSerializer, ActivityLogSerializer, MedicationLogSerializer,
    SleepLogSerializer, SymptomTrackerSerializer, CopingStrategySerializer,
    PatientMilestoneSerializer, ReflectionPromptSerializer, ReflectionEntrySerializer,
    PatientGoalSerializer, ProgressTrackingSerializer
)

User = get_user_model()


@extend_schema(
    tags=['History'],
    summary="Patient history management",
    description="Comprehensive endpoint for managing all patient history data including dashboard, entries creation, and listing with flexible filtering",
    parameters=[
        OpenApiParameter(name='action', description='Action to perform: dashboard, list, create', required=False, type=str),
        OpenApiParameter(name='type', description='Entry type: mood, journal, activity, sleep, symptom, coping, milestone, goal, progress, reflection, medication', required=False, type=str),
        OpenApiParameter(name='start_date', description='Filter entries from this date (YYYY-MM-DD)', required=False, type=str),
        OpenApiParameter(name='end_date', description='Filter entries until this date (YYYY-MM-DD)', required=False, type=str),
        OpenApiParameter(name='limit', description='Limit number of results (default: 20)', required=False, type=int),
        OpenApiParameter(name='favorites_only', description='Show only favorite entries (true/false)', required=False, type=str),
        OpenApiParameter(name='status', description='Filter by status (for goals: active, completed, paused)', required=False, type=str),
    ],
    examples=[
        OpenApiExample(
            'Dashboard Request',
            summary='Get patient history dashboard',
            description='Get comprehensive dashboard with recent entries and statistics',
            value='GET /api/history/?action=dashboard',
            request_only=True,
        ),
        OpenApiExample(
            'List Mood Entries',
            summary='List mood entries with date filter',
            description='Get mood entries from the last 7 days',
            value='GET /api/history/?action=list&type=mood&start_date=2024-01-08&limit=10',
            request_only=True,
        ),
        OpenApiExample(
            'Create Mood Entry',
            summary='Create a new mood entry',
            description='Record current mood with detailed tracking',
            value={
                "type": "mood",
                "mood": "happy",
                "mood_score": 7,
                "energy_level": 8,
                "anxiety_level": 3,
                "triggers_list": ["work", "social"],
                "notes": "Had a good day at work"
            },
            request_only=True,
        ),
        OpenApiExample(
            'Create Journal Entry',
            summary='Create a new journal entry',
            description='Write a personal journal entry',
            value={
                "type": "journal",
                "title": "Reflection on Today",
                "content": "Today was challenging but rewarding...",
                "entry_type": "daily",
                "mood_before": 4,
                "mood_after": 7,
                "tags_list": ["anxiety", "progress"]
            },
            request_only=True,
        ),
    ]
)
class PatientHistoryView(APIView):
    """Main endpoint for all patient history operations"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Handle GET requests - dashboard or list entries"""
        user = request.user
        if user.user_type != 'patient':
            return Response(
                {'detail': 'Only patients can access history data.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        action = request.query_params.get('action', 'dashboard')
        
        if action == 'dashboard':
            return self.get_dashboard(user)
        elif action == 'list':
            return self.list_entries(user, request.query_params)
        else:
            return Response(
                {'detail': 'Invalid action. Use "dashboard" or "list".'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def post(self, request):
        """Handle POST requests - create new entries"""
        user = request.user
        if user.user_type != 'patient':
            return Response(
                {'detail': 'Only patients can create history entries.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        entry_type = request.data.get('type')
        if not entry_type:
            return Response(
                {'detail': 'Entry type is required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return self.create_entry(user, entry_type, request.data)
    
    def get_dashboard(self, user):
        """Get comprehensive dashboard data"""
        # Get recent entries (last 7 days)
        week_ago = timezone.now() - timedelta(days=7)
        
        # Recent entries from different types
        recent_mood = MoodEntry.objects.filter(patient=user, created_at__gte=week_ago)[:3]
        recent_journal = JournalEntry.objects.filter(patient=user, created_at__gte=week_ago)[:3]
        recent_activities = ActivityLog.objects.filter(patient=user, activity_date__gte=week_ago)[:3]
        active_goals = PatientGoal.objects.filter(patient=user, status='active')[:3]
        recent_milestones = PatientMilestone.objects.filter(patient=user, achieved_date__gte=week_ago.date())[:3]
        
        # Statistics
        total_entries = {
            'mood': MoodEntry.objects.filter(patient=user).count(),
            'journal': JournalEntry.objects.filter(patient=user).count(),
            'activities': ActivityLog.objects.filter(patient=user).count(),
            'goals': PatientGoal.objects.filter(patient=user).count(),
            'milestones': PatientMilestone.objects.filter(patient=user).count(),
        }
        
        # Mood trend (last 7 days)
        mood_trend = []
        for i in range(7):
            day = timezone.now().date() - timedelta(days=i)
            avg_mood = MoodEntry.objects.filter(
                patient=user, created_at__date=day
            ).aggregate(avg=Avg('mood_score'))['avg']
            mood_trend.append(int(avg_mood) if avg_mood else 0)
        mood_trend.reverse()
        
        # Calculate streak days
        streak_days = self.calculate_streak_days(user)
        
        # Average mood (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        avg_mood = MoodEntry.objects.filter(
            patient=user, created_at__gte=thirty_days_ago
        ).aggregate(avg=Avg('mood_score'))['avg'] or 0
        
        dashboard_data = {
            'recent_entries': {
                'mood': MoodEntrySerializer(recent_mood, many=True).data,
                'journal': JournalEntrySerializer(recent_journal, many=True).data,
                'activities': ActivityLogSerializer(recent_activities, many=True).data,
                'goals': PatientGoalSerializer(active_goals, many=True).data,
                'milestones': PatientMilestoneSerializer(recent_milestones, many=True).data,
            },
            'statistics': {
                'total_entries': total_entries,
                'mood_trend': mood_trend,
                'average_mood': round(avg_mood, 1),
                'streak_days': streak_days,
            }
        }
        
        return Response(dashboard_data, status=status.HTTP_200_OK)
    
    def list_entries(self, user, params):
        """List entries with filtering"""
        entry_type = params.get('type')
        if not entry_type:
            return Response(
                {'detail': 'Entry type is required for listing.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get base queryset based on type
        queryset = self.get_queryset_by_type(user, entry_type)
        if queryset is None:
            return Response(
                {'detail': 'Invalid entry type.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Apply filters
        queryset = self.apply_filters(queryset, params, entry_type)
        
        # Limit results
        limit = int(params.get('limit', 20))
        queryset = queryset[:limit]
        
        # Serialize data
        serializer_class = self.get_serializer_by_type(entry_type)
        serialized_data = serializer_class(queryset, many=True).data
        
        return Response({
            'type': entry_type,
            'count': len(serialized_data),
            'entries': serialized_data
        }, status=status.HTTP_200_OK)
    
    def create_entry(self, user, entry_type, data):
        """Create new entry based on type"""
        serializer_class = self.get_create_serializer_by_type(entry_type)
        if not serializer_class:
            return Response(
                {'detail': 'Invalid entry type for creation.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Remove type from data as it's not needed in serializer
        entry_data = data.copy()
        entry_data.pop('type', None)
        
        serializer = serializer_class(data=entry_data, context={'request': {'user': user}})
        if serializer.is_valid():
            entry = serializer.save()
            response_serializer = self.get_serializer_by_type(entry_type)
            return Response({
                'detail': f'{entry_type.title()} entry created successfully.',
                'entry': response_serializer(entry).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset_by_type(self, user, entry_type):
        """Get queryset based on entry type"""
        querysets = {
            'mood': MoodEntry.objects.filter(patient=user).order_by('-created_at'),
            'journal': JournalEntry.objects.filter(patient=user).order_by('-created_at'),
            'activity': ActivityLog.objects.filter(patient=user).order_by('-activity_date'),
            'sleep': SleepLog.objects.filter(patient=user).order_by('-sleep_date'),
            'symptom': SymptomTracker.objects.filter(patient=user).order_by('-symptom_date'),
            'coping': CopingStrategy.objects.filter(patient=user).order_by('-average_effectiveness'),
            'milestone': PatientMilestone.objects.filter(patient=user).order_by('-achieved_date'),
            'goal': PatientGoal.objects.filter(patient=user).order_by('-created_at'),
            'progress': ProgressTracking.objects.filter(patient=user).order_by('-date'),
            'reflection': ReflectionEntry.objects.filter(patient=user).order_by('-created_at'),
            'medication': MedicationLog.objects.filter(patient=user).order_by('-log_date'),
        }
        return querysets.get(entry_type)
    
    def get_serializer_by_type(self, entry_type):
        """Get serializer class based on entry type"""
        serializers = {
            'mood': MoodEntrySerializer,
            'journal': JournalEntrySerializer,
            'activity': ActivityLogSerializer,
            'sleep': SleepLogSerializer,
            'symptom': SymptomTrackerSerializer,
            'coping': CopingStrategySerializer,
            'milestone': PatientMilestoneSerializer,
            'goal': PatientGoalSerializer,
            'progress': ProgressTrackingSerializer,
            'reflection': ReflectionEntrySerializer,
            'medication': MedicationLogSerializer,
        }
        return serializers.get(entry_type)
    
    def get_create_serializer_by_type(self, entry_type):
        """Get create serializer class based on entry type"""
        serializers = {
            'mood': MoodEntryCreateSerializer,
            'journal': JournalEntryCreateSerializer,
            'activity': ActivityLogSerializer,
            'sleep': SleepLogSerializer,
            'symptom': SymptomTrackerSerializer,
            'coping': CopingStrategySerializer,
            'milestone': PatientMilestoneSerializer,
            'progress': ProgressTrackingSerializer,
            'reflection': ReflectionEntrySerializer,
            'medication': MedicationLogSerializer,
        }
        return serializers.get(entry_type)
    
    def apply_filters(self, queryset, params, entry_type):
        """Apply filters based on parameters"""
        # Date filters
        start_date = params.get('start_date')
        end_date = params.get('end_date')
        
        if start_date:
            if entry_type in ['mood', 'journal', 'reflection']:
                queryset = queryset.filter(created_at__date__gte=start_date)
            elif entry_type == 'activity':
                queryset = queryset.filter(activity_date__date__gte=start_date)
            elif entry_type == 'sleep':
                queryset = queryset.filter(sleep_date__gte=start_date)
            elif entry_type == 'symptom':
                queryset = queryset.filter(symptom_date__date__gte=start_date)
            elif entry_type == 'milestone':
                queryset = queryset.filter(achieved_date__gte=start_date)
            elif entry_type == 'progress':
                queryset = queryset.filter(date__gte=start_date)
            elif entry_type == 'medication':
                queryset = queryset.filter(log_date__gte=start_date)
        
        if end_date:
            if entry_type in ['mood', 'journal', 'reflection']:
                queryset = queryset.filter(created_at__date__lte=end_date)
            elif entry_type == 'activity':
                queryset = queryset.filter(activity_date__date__lte=end_date)
            elif entry_type == 'sleep':
                queryset = queryset.filter(sleep_date__lte=end_date)
            elif entry_type == 'symptom':
                queryset = queryset.filter(symptom_date__date__lte=end_date)
            elif entry_type == 'milestone':
                queryset = queryset.filter(achieved_date__lte=end_date)
            elif entry_type == 'progress':
                queryset = queryset.filter(date__lte=end_date)
            elif entry_type == 'medication':
                queryset = queryset.filter(log_date__lte=end_date)
        
        # Favorites filter
        favorites_only = params.get('favorites_only')
        if favorites_only == 'true':
            if entry_type in ['journal', 'coping']:
                queryset = queryset.filter(is_favorite=True)
        
        # Status filter
        status_filter = params.get('status')
        if status_filter and entry_type == 'goal':
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    def calculate_streak_days(self, user):
        """Calculate consecutive days with any entries"""
        streak = 0
        current_date = timezone.now().date()
        
        while True:
            has_entry = (
                MoodEntry.objects.filter(patient=user, created_at__date=current_date).exists() or
                JournalEntry.objects.filter(patient=user, created_at__date=current_date).exists() or
                ActivityLog.objects.filter(patient=user, activity_date__date=current_date).exists()
            )
            
            if has_entry:
                streak += 1
                current_date -= timedelta(days=1)
            else:
                break
        
        return streak


@extend_schema(
    tags=['History'],
    summary="Individual history entry management",
    description="Retrieve, update, or delete individual history entries of any type",
    examples=[
        OpenApiExample(
            'Update Mood Entry',
            summary='Update a mood entry',
            description='Update mood entry details',
            value={
                "mood_score": 8,
                "notes": "Updated notes - feeling much better now",
                "energy_level": 9
            },
            request_only=True,
        ),
        OpenApiExample(
            'Update Journal Entry',
            summary='Update a journal entry',
            description='Update journal entry content',
            value={
                "title": "Updated Title",
                "content": "Updated content with new insights...",
                "is_favorite": True
            },
            request_only=True,
        ),
    ]
)
class HistoryEntryView(APIView):
    """Manage individual history entries"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, pk):
        """Get individual entry details"""
        user = request.user
        if user.user_type != 'patient':
            return Response(
                {'detail': 'Only patients can access history entries.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        entry, entry_type = self.get_entry_by_id(user, pk)
        if not entry:
            return Response(
                {'detail': 'Entry not found.'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer_class = self.get_serializer_by_type(entry_type)
        return Response({
            'type': entry_type,
            'entry': serializer_class(entry).data
        }, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        """Update individual entry"""
        user = request.user
        if user.user_type != 'patient':
            return Response(
                {'detail': 'Only patients can update history entries.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        entry, entry_type = self.get_entry_by_id(user, pk)
        if not entry:
            return Response(
                {'detail': 'Entry not found.'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer_class = self.get_serializer_by_type(entry_type)
        serializer = serializer_class(entry, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_entry = serializer.save()
            return Response({
                'detail': f'{entry_type.title()} entry updated successfully.',
                'entry': serializer_class(updated_entry).data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Delete individual entry"""
        user = request.user
        if user.user_type != 'patient':
            return Response(
                {'detail': 'Only patients can delete history entries.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        entry, entry_type = self.get_entry_by_id(user, pk)
        if not entry:
            return Response(
                {'detail': 'Entry not found.'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        entry.delete()
        return Response({
            'detail': f'{entry_type.title()} entry deleted successfully.'
        }, status=status.HTTP_200_OK)
    
    def get_entry_by_id(self, user, entry_id):
        """Find entry by ID across all models"""
        models_and_types = [
            (MoodEntry, 'mood'),
            (JournalEntry, 'journal'),
            (ActivityLog, 'activity'),
            (SleepLog, 'sleep'),
            (SymptomTracker, 'symptom'),
            (CopingStrategy, 'coping'),
            (PatientMilestone, 'milestone'),
            (PatientGoal, 'goal'),
            (ProgressTracking, 'progress'),
            (ReflectionEntry, 'reflection'),
            (MedicationLog, 'medication'),
        ]
        
        for model, entry_type in models_and_types:
            try:
                entry = model.objects.get(id=entry_id, patient=user)
                return entry, entry_type
            except model.DoesNotExist:
                continue
        
        return None, None
    
    def get_serializer_by_type(self, entry_type):
        """Get serializer class based on entry type"""
        serializers = {
            'mood': MoodEntrySerializer,
            'journal': JournalEntrySerializer,
            'activity': ActivityLogSerializer,
            'sleep': SleepLogSerializer,
            'symptom': SymptomTrackerSerializer,
            'coping': CopingStrategySerializer,
            'milestone': PatientMilestoneSerializer,
            'goal': PatientGoalSerializer,
            'progress': ProgressTrackingSerializer,
            'reflection': ReflectionEntrySerializer,
            'medication': MedicationLogSerializer,
        }
        return serializers.get(entry_type)


@extend_schema(
    tags=['History'],
    summary="History analytics and insights",
    description="Get comprehensive analytics and insights from patient history data",
    parameters=[
        OpenApiParameter(name='type', description='Analytics type: mood, activity, sleep, symptoms, overview', required=False, type=str),
        OpenApiParameter(name='days', description='Number of days to include (default: 30)', required=False, type=int),
        OpenApiParameter(name='group_by', description='Group data by: day, week, month', required=False, type=str),
    ],
    examples=[
        OpenApiExample(
            'Mood Analytics',
            summary='Get mood analytics',
            description='Get comprehensive mood analytics with trends and correlations',
            value='GET /api/history/analytics/?type=mood&days=30&group_by=day',
            request_only=True,
        ),
        OpenApiExample(
            'Overview Analytics',
            summary='Get overview analytics',
            description='Get overall analytics across all entry types',
            value='GET /api/history/analytics/?type=overview&days=90',
            request_only=True,
        ),
    ]
)
class HistoryAnalyticsView(APIView):
    """Get analytics and insights from history data"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get analytics based on type and parameters"""
        user = request.user
        if user.user_type != 'patient':
            return Response(
                {'detail': 'Only patients can access analytics.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        analytics_type = request.query_params.get('type', 'overview')
        days = int(request.query_params.get('days', 30))
        group_by = request.query_params.get('group_by', 'day')
        
        start_date = timezone.now() - timedelta(days=days)
        
        if analytics_type == 'mood':
            return self.get_mood_analytics(user, start_date, group_by)
        elif analytics_type == 'activity':
            return self.get_activity_analytics(user, start_date, group_by)
        elif analytics_type == 'sleep':
            return self.get_sleep_analytics(user, start_date, group_by)
        elif analytics_type == 'symptoms':
            return self.get_symptom_analytics(user, start_date, group_by)
        elif analytics_type == 'overview':
            return self.get_overview_analytics(user, start_date)
        else:
            return Response(
                {'detail': 'Invalid analytics type.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def get_mood_analytics(self, user, start_date, group_by):
        """Get mood-specific analytics"""
        mood_entries = MoodEntry.objects.filter(
            patient=user, created_at__gte=start_date
        ).order_by('created_at')
        
        if not mood_entries.exists():
            return Response({'message': 'No mood data available'}, status=status.HTTP_200_OK)
        
        analytics = {
            'average_mood': mood_entries.aggregate(avg=Avg('mood_score'))['avg'],
            'mood_distribution': self.get_mood_distribution(mood_entries),
            'trend_data': self.get_mood_trend(mood_entries, group_by),
            'trigger_analysis': self.get_trigger_analysis(mood_entries),
            'correlations': self.get_mood_correlations(mood_entries),
        }
        
        return Response(analytics, status=status.HTTP_200_OK)
    
    def get_activity_analytics(self, user, start_date, group_by):
        """Get activity-specific analytics"""
        activities = ActivityLog.objects.filter(
            patient=user, activity_date__gte=start_date
        ).order_by('activity_date')
        
        analytics = {
            'total_activities': activities.count(),
            'activity_types': list(activities.values('activity_type').annotate(count=Count('id'))),
            'mood_impact': activities.aggregate(avg=Avg('mood_after'))['avg'],
            'most_effective': activities.order_by('-mood_after')[:5].values('activity_name', 'mood_after'),
        }
        
        return Response(analytics, status=status.HTTP_200_OK)
    
    def get_sleep_analytics(self, user, start_date, group_by):
        """Get sleep-specific analytics"""
        sleep_logs = SleepLog.objects.filter(
            patient=user, sleep_date__gte=start_date.date()
        ).order_by('sleep_date')
        
        analytics = {
            'average_hours': sleep_logs.aggregate(avg=Avg('hours_slept'))['avg'],
            'average_quality': sleep_logs.aggregate(avg=Avg('sleep_quality_score'))['avg'],
            'sleep_pattern': list(sleep_logs.values('sleep_date', 'hours_slept', 'sleep_quality_score')),
        }
        
        return Response(analytics, status=status.HTTP_200_OK)
    
    def get_symptom_analytics(self, user, start_date, group_by):
        """Get symptom-specific analytics"""
        symptoms = SymptomTracker.objects.filter(
            patient=user, symptom_date__gte=start_date
        ).order_by('symptom_date')
        
        analytics = {
            'symptom_frequency': list(symptoms.values('symptom_type').annotate(count=Count('id'))),
            'average_severity': symptoms.aggregate(avg=Avg('severity'))['avg'],
            'most_common_triggers': self.get_common_triggers(symptoms),
        }
        
        return Response(analytics, status=status.HTTP_200_OK)
    
    def get_overview_analytics(self, user, start_date):
        """Get comprehensive overview analytics"""
        analytics = {
            'entry_counts': {
                'mood': MoodEntry.objects.filter(patient=user, created_at__gte=start_date).count(),
                'journal': JournalEntry.objects.filter(patient=user, created_at__gte=start_date).count(),
                'activities': ActivityLog.objects.filter(patient=user, activity_date__gte=start_date).count(),
                'sleep': SleepLog.objects.filter(patient=user, sleep_date__gte=start_date.date()).count(),
                'symptoms': SymptomTracker.objects.filter(patient=user, symptom_date__gte=start_date).count(),
            },
            'engagement_score': self.calculate_engagement_score(user, start_date),
            'progress_indicators': self.get_progress_indicators(user, start_date),
        }
        
        return Response(analytics, status=status.HTTP_200_OK)
    
    def get_mood_distribution(self, mood_entries):
        """Get mood distribution"""
        distribution = defaultdict(int)
        for entry in mood_entries:
            distribution[entry.mood] += 1
        return dict(distribution)
    
    def get_mood_trend(self, mood_entries, group_by):
        """Get mood trend data"""
        trend_data = []
        # Implementation depends on group_by parameter
        # Simplified version here
        for entry in mood_entries:
            trend_data.append({
                'date': entry.created_at.date().isoformat(),
                'mood_score': entry.mood_score
            })
        return trend_data
    
    def get_trigger_analysis(self, mood_entries):
        """Analyze mood triggers"""
        trigger_data = defaultdict(list)
        for entry in mood_entries:
            if entry.triggers:
                triggers = entry.get_triggers_list()
                for trigger in triggers:
                    trigger_data[trigger].append(entry.mood_score)
        
        return [
            {
                'trigger': trigger,
                'average_mood': sum(scores) / len(scores),
                'frequency': len(scores)
            }
            for trigger, scores in trigger_data.items()
        ]
    
    def get_mood_correlations(self, mood_entries):
        """Get mood correlations with other factors"""
        correlations = {}
        
        # Sleep correlation
        sleep_data = [(e.mood_score, e.sleep_quality) for e in mood_entries if e.sleep_quality]
        if sleep_data:
            correlations['sleep_quality'] = self.calculate_correlation(sleep_data)
        
        # Energy correlation
        energy_data = [(e.mood_score, e.energy_level) for e in mood_entries if e.energy_level]
        if energy_data:
            correlations['energy_level'] = self.calculate_correlation(energy_data)
        
        return correlations
    
    def get_common_triggers(self, symptoms):
        """Get most common symptom triggers"""
        triggers = defaultdict(int)
        for symptom in symptoms:
            if symptom.triggers:
                for trigger in symptom.triggers.split(','):
                    triggers[trigger.strip()] += 1
        
        return sorted(triggers.items(), key=lambda x: x[1], reverse=True)[:5]
    
    def calculate_engagement_score(self, user, start_date):
        """Calculate user engagement score"""
        days_in_period = (timezone.now() - start_date).days
        total_entries = (
            MoodEntry.objects.filter(patient=user, created_at__gte=start_date).count() +
            JournalEntry.objects.filter(patient=user, created_at__gte=start_date).count() +
            ActivityLog.objects.filter(patient=user, activity_date__gte=start_date).count()
        )
        
        return min(100, int((total_entries / days_in_period) * 10)) if days_in_period > 0 else 0
    
    def get_progress_indicators(self, user, start_date):
        """Get progress indicators"""
        # Get mood improvement over time
        mood_entries = MoodEntry.objects.filter(
            patient=user, created_at__gte=start_date
        ).order_by('created_at')
        
        if mood_entries.count() >= 2:
            first_half = mood_entries[:mood_entries.count()//2]
            second_half = mood_entries[mood_entries.count()//2:]
            
            first_avg = first_half.aggregate(avg=Avg('mood_score'))['avg'] or 0
            second_avg = second_half.aggregate(avg=Avg('mood_score'))['avg'] or 0
            
            mood_improvement = second_avg - first_avg
        else:
            mood_improvement = 0
        
        return {
            'mood_improvement': round(mood_improvement, 2),
            'active_goals': PatientGoal.objects.filter(patient=user, status='active').count(),
            'completed_goals': PatientGoal.objects.filter(patient=user, status='completed').count(),
            'milestones_achieved': PatientMilestone.objects.filter(
                patient=user, achieved_date__gte=start_date.date()
            ).count(),
        }
    
    def calculate_correlation(self, data_pairs):
        """Simple correlation calculation"""
        if len(data_pairs) < 2:
            return 0
        
        x_values = [pair[0] for pair in data_pairs]
        y_values = [pair[1] for pair in data_pairs]
        
        n = len(data_pairs)
        sum_x = sum(x_values)
        sum_y = sum(y_values)
        sum_xy = sum(x * y for x, y in data_pairs)
        sum_x2 = sum(x * x for x in x_values)
        sum_y2 = sum(y * y for y in y_values)
        
        numerator = n * sum_xy - sum_x * sum_y
        denominator = ((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y)) ** 0.5
        
        return numerator / denominator if denominator != 0 else 0