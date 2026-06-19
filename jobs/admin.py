from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "company",
        "job_type",
        "work_type",
        "status",
        "deadline",
    )

    list_filter = (
        "status",
        "job_type",
        "work_type",
    )

    search_fields = (
        "title",
        "company__email",
    )

    ordering = ("-created_at",)