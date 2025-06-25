from django.urls import path
from .views import ApplyToJobView

urlpatterns = [
    path('jobs/<int:job_id>/apply/', ApplyToJobView.as_view(), name='apply-to-job'),
]
