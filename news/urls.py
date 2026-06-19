from django.urls import path
from .views import fetch_news,fetch_remotive_jobs

urlpatterns = [
    path('news/', fetch_news),
    path('fetch_remote_jobs',fetch_remotive_jobs)
]
