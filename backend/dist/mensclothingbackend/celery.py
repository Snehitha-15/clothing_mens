from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mensclothingbackend.settings")

app = Celery("mensclothingbackend")

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# Optional: Debug logs
@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
