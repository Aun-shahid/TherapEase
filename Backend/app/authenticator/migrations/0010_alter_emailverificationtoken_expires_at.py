# Generated by Django 5.2.3 on 2025-07-29 19:46

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authenticator', '0009_alter_emailverificationtoken_expires_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emailverificationtoken',
            name='expires_at',
            field=models.DateTimeField(default=datetime.datetime(2025, 7, 30, 19, 46, 44, 732680, tzinfo=datetime.timezone.utc)),
        ),
    ]
