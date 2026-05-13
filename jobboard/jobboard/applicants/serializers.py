from rest_framework import serializers
from .models import Application
from .models import SavedJob
from jobs.models import Job

class ApplicationSerializer(serializers.ModelSerializer):
    job_id = serializers.IntegerField(source="job.id", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)

    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['applicant', 'applied_at']



# applications/serializers.py


class ApplicantApplicationSummarySerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title')

    class Meta:
        model = Application
        fields = ['job_title', 'status', 'applied_at']  

# jobs/serializers.py

from rest_framework import serializers
from .models import SavedJob

class SavedJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedJob
        fields = '__all__'
        read_only_fields = ['applicant']
