from django.urls import path
from .views import ApplyToJobView
# from .views import SavedJobAPIView
# from .models import Application, SavedJob

urlpatterns = [
    path('jobs/<int:job_id>/apply/', ApplyToJobView.as_view(), name='apply-to-job'),
    # path('saved-jobs/', SavedJobAPIView.as_view(), name='saved-jobs'),

]
