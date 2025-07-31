

from celery import shared_task
from .models import SavedJob
from django.utils import timezone

@shared_task
def delete_expired_saved_jobs():
    print("⏰ Running delete_expired_saved_jobs task")

    deleted_count, _ = SavedJob.objects.filter(job__deadline__lt=timezone.now()).delete()
    print(f"Deleted {deleted_count} expired saved jobs")
    return f"{deleted_count} expired saved jobs deleted"
