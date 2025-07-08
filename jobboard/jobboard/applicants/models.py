from django.db import models
from django.conf import settings
from jobs.models import Job
from accounts.models import UserManager



class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('rejected', 'Rejected'),
        ('hired', 'Hired'),
    ]

    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)

    #  Professional info
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    contact_email = models.EmailField()
    city = models.CharField(max_length=50, blank=True, null=True)

    # Documents & links
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

    github_url = models.URLField(blank=True, null=True)


    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
         unique_together = ('applicant', 'job')

    def __str__(self):
        return f"{self.full_name} → {self.job.title}"
