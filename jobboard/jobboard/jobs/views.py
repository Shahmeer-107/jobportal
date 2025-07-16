from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Job
from .serializers import JobSerializer
from .permissions import IsCompanyAndOwner
from rest_framework.decorators import action
from rest_framework.response import Response


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'company__email']

    def get_queryset(self):
        user = self.request.user
        # ✅ If company is logged in, return all jobs (filter logic handled separately)
        if user.is_authenticated and user.role == 'company':
            return Job.objects.all()
        return Job.objects.all()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsCompanyAndOwner()]
        return [IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(company=self.request.user)

    # ✅ Custom route to show only that company’s jobs
    @action(detail=False, methods=['get'], url_path='my_jobs', permission_classes=[IsCompanyAndOwner])
    def my_jobs(self, request):
        jobs = Job.objects.filter(company=request.user)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)
