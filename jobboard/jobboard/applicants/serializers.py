from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    # job_title = serializers.CharField(source='job.title', read_only=True)



    
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