

from celery import shared_task
from .models import SavedJob
from django.utils import timezone
from jobs.models import Job


@shared_task
def delete_expired_saved_jobs():
    print("⏰ Running delete_expired_saved_jobs task")

    deleted_count, _ = SavedJob.objects.filter(job__deadline__lt=timezone.now()).delete()
    print(f"Deleted {deleted_count} expired saved jobs")
    return f"{deleted_count} expired saved jobs deleted"



@shared_task
def close_expired_jobs():
    today = timezone.now().date()

    updated = Job.objects.filter(
        deadline__lt=today,
        status='open'
    ).update(status='closed')

    print(f"{updated} jobs marked as closed")