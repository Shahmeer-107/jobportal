from django.db import models
from django.conf import settings

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

    EXPERIENCE_LEVEL_CHOICES = [
        ('junior', 'Junior'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]

    # Basic Info
    title = models.CharField(max_length=255)
    description = models.TextField(default='No description provided')

    # Job Details
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='permanent')
    work_type = models.CharField(max_length=20, choices=WORK_TYPE_CHOICES, default='remote')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, default='junior')

    # Salary
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='USD')

    # Skills & Responsibilities
    skills = models.TextField(help_text="Comma separated skills", blank=True)
    responsibilities = models.TextField(blank=True)

    # Location
    location = models.CharField(max_length=255, blank=True)

    # Deadline
    deadline = models.DateField()

    # Company (internal jobs)
    company = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # Status
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')

    # External job support
    source = models.CharField(max_length=100, default='internal')  # internal / external
    external_id = models.CharField(max_length=255, blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def applicants_count(self):
        return self.application_set.count()

    def __str__(self):
        return self.title