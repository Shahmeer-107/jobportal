from django.db import models
from django.conf import settings

class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('contract', 'Contract'),
        ('permanent', 'Permanent'),
        ('internship', 'Internship'),
    ]
    WORK_TYPE_CHOICES = [
        ('remote', 'Remote'),
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(default='no description')
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='permanent')
    work_type = models.CharField(max_length=20, choices=WORK_TYPE_CHOICES,default='remote')
    deadline = models.DateField()
    company = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


    