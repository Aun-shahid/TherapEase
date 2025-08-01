# Generated by Django 5.2.3 on 2025-07-29 17:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_patientprofile_connected_at_patientprofile_therapist_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='patientprofile',
            options={'ordering': ['-user__created_at']},
        ),
        migrations.AlterModelOptions(
            name='therapistprofile',
            options={'ordering': ['-user__created_at']},
        ),
        migrations.AddField(
            model_name='patientprofile',
            name='created_by_therapist',
            field=models.ForeignKey(blank=True, help_text='Therapist who created this patient profile', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_patients', to='users.therapistprofile'),
        ),
        migrations.AddField(
            model_name='patientprofile',
            name='patient_id',
            field=models.CharField(blank=True, max_length=20, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='patientprofile',
            name='preferred_session_days',
            field=models.CharField(blank=True, help_text="Comma-separated weekdays (e.g., 'monday,wednesday,friday')", max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='patientprofile',
            name='primary_concern',
            field=models.TextField(blank=True, help_text='Primary concern or issue', null=True),
        ),
        migrations.AddField(
            model_name='patientprofile',
            name='session_frequency',
            field=models.CharField(choices=[('weekly', 'Weekly'), ('biweekly', 'Biweekly'), ('monthly', 'Monthly'), ('as_needed', 'As Needed')], default='weekly', max_length=20),
        ),
        migrations.AddField(
            model_name='patientprofile',
            name='therapy_start_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='therapistprofile',
            name='bio',
            field=models.TextField(blank=True, help_text='Professional bio/description', null=True),
        ),
        migrations.AddField(
            model_name='therapistprofile',
            name='consultation_fee',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='therapistprofile',
            name='languages_spoken',
            field=models.CharField(blank=True, help_text="Comma-separated languages (e.g., 'English,Urdu')", max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='therapistprofile',
            name='max_patients',
            field=models.IntegerField(default=50, help_text='Maximum number of patients'),
        ),
        migrations.AddField(
            model_name='therapistprofile',
            name='pairing_code',
            field=models.CharField(blank=True, help_text='Short code for patient pairing', max_length=8, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='therapistprofile',
            name='session_duration_minutes',
            field=models.IntegerField(default=60, help_text='Default session duration in minutes'),
        ),
        migrations.AddField(
            model_name='therapistprofile',
            name='working_days',
            field=models.CharField(blank=True, help_text="Comma-separated working days (e.g., 'monday,tuesday,wednesday')", max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='therapistprofile',
            name='working_hours_end',
            field=models.TimeField(blank=True, help_text='End of working hours', null=True),
        ),
        migrations.AddField(
            model_name='therapistprofile',
            name='working_hours_start',
            field=models.TimeField(blank=True, help_text='Start of working hours', null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='gender',
            field=models.CharField(blank=True, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other'), ('prefer_not_to_say', 'Prefer not to say')], max_length=20, null=True),
        ),
    ]
