from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    applicants_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'description',
            'category',
            'degree_required',
            'company_full_name',
            
            'job_type',
            'work_type',
            'experience_level',
            'salary_min',
            'salary_max',
            'currency',
            'skills',
            'responsibilities',
            'location',
            'deadline',
            'status',
            'source',
            'external_id',
            'company_name',
            'created_at',
            'updated_at',
            'applicants_count',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_applicants_count(self, obj):
        return obj.application_set.count()