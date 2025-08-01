# Generated by Django 5.2.3 on 2025-07-29 19:46

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('therapy_sessions', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='session',
            name='ai_key_topics',
            field=models.JSONField(blank=True, help_text='AI-identified key topics', null=True),
        ),
        migrations.AddField(
            model_name='session',
            name='ai_mood_analysis',
            field=models.JSONField(blank=True, help_text='AI-generated mood analysis', null=True),
        ),
        migrations.AddField(
            model_name='session',
            name='ai_recommendations',
            field=models.TextField(blank=True, help_text='AI-generated recommendations', null=True),
        ),
        migrations.AddField(
            model_name='session',
            name='ai_sentiment_score',
            field=models.FloatField(blank=True, help_text='AI sentiment analysis score', null=True),
        ),
        migrations.AddField(
            model_name='session',
            name='is_quick_session',
            field=models.BooleanField(default=False, help_text='True if this is a quick session without assigned patient'),
        ),
        migrations.AddField(
            model_name='session',
            name='quick_session_patient_name',
            field=models.CharField(blank=True, help_text='Patient name for quick sessions', max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='session',
            name='transcription_id',
            field=models.UUIDField(blank=True, help_text='ID linking to transcription record', null=True),
        ),
        migrations.AlterField(
            model_name='session',
            name='patient',
            field=models.ForeignKey(blank=True, help_text='Patient (optional for quick sessions)', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='patient_sessions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='session',
            name='session_number',
            field=models.PositiveIntegerField(blank=True, help_text='Sequential session number for this patient', null=True),
        ),
        migrations.CreateModel(
            name='PatientPairingRequest',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('therapist_pin', models.CharField(help_text='Therapist PIN used for pairing', max_length=9)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected'), ('expired', 'Expired')], default='pending', max_length=20)),
                ('patient_message', models.TextField(blank=True, help_text='Optional message from patient', null=True)),
                ('therapist_response', models.TextField(blank=True, help_text="Therapist's response message", null=True)),
                ('reviewed_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('expires_at', models.DateTimeField(help_text='When this pairing request expires')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pairing_requests', to=settings.AUTH_USER_MODEL)),
                ('therapist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_pairing_requests', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'patient_pairing_requests',
                'ordering': ['-created_at'],
            },
        ),
    ]
