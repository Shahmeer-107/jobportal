from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Job
from .serializers import JobSerializer
from .permissions import IsCompanyAndOwner

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]

    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'company__username']

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [IsCompanyAndOwner()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(company=self.request.user)