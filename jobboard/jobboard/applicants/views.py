from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.core.mail import send_mail
from jobs.models import Job
from .models import Application
from .serializers import ApplicationSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class ApplyToJobView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=ApplicationSerializer,
        operation_summary="Apply to a Job",
        operation_description="Allows an authenticated applicant to apply for a job.",
        responses={201: ApplicationSerializer}
    )
    def post(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)

        if job.deadline and job.deadline < timezone.now():
            return Response({"error": "Deadline passed"}, status=400)

        if Application.objects.filter(applicant=request.user, job=job).exists():
            return Response({"error": "You already applied to this job"}, status=400)

        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            application = serializer.save(applicant=request.user, job=job)

            send_mail(
                subject="Application Submitted Successfully",
                message=f"Dear {request.user.username},\n\nYou applied to: {job.title}.",
                from_email="noreply@jobconnect.com",
                recipient_list=[application.contact_email],
                fail_silently=True,
            )

            return Response(ApplicationSerializer(application).data, status=201)

        return Response(serializer.errors, status=400)
