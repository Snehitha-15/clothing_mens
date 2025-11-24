# Generated manually to fix missing fields

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mensclothingfrontend', '0004_remove_user_change_email_otp_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='reset_token',
            field=models.UUIDField(default=uuid.uuid4, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='signup_token',
            field=models.UUIDField(default=uuid.uuid4, null=True),
        ),
    ]
