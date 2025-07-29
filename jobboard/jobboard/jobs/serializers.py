from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)  # 👈

    class Meta:
        model = Job
        fields = ['id', 'title', 'deadline', 'company_name', 'description','job_type', 'work_type']
        # read_only_fields = ['company']


