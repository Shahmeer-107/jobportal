from django.contrib import admin
from .models import Application

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "job",
        "status",
        "contact_email",
        "applied_at",
    )

    list_filter = (
        "status",
    )

    search_fields = (
        "full_name",
        "contact_email",
        "job__title",
    )

    ordering = ("-applied_at",)




admin.site.site_header = "Job Portal Admin"
admin.site.site_title = "Job Portal"
admin.site.index_title = "Welcome to Job Portal Dashboard"    