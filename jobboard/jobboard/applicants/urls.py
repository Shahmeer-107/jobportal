from django.urls import path
from .views import ApplyToJobView
# from .views import SavedJobAPIView
from .views import SavedJobCreateAPIView, SavedJobListAPIView
from .models import Application, SavedJob

urlpatterns = [
    path('jobs/<int:job_id>/apply/', ApplyToJobView.as_view(), name='apply-to-job'),
    path('save-job/', SavedJobCreateAPIView.as_view(), name='save-job'),
    path('saved-jobs/', SavedJobListAPIView.as_view(), name='saved-jobs'),

]
