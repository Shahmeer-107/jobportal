from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.core.mail import send_mail
from jobs.models import Job
from .models import Application
from .serializers import ApplicationSerializer

class ApplyToJobView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)

        if job.deadline and job.deadline < timezone.now():
            return Response({"error": "Deadline passed"}, status=400)

        if Application.objects.filter(applicant=request.user, job=job).exists():
            return Response({"error": "You already applied to this job"}, status=400)

        #  You just pass the request data (except applicant/job which is set manually)
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            # Set job and applicant during save
            application = serializer.save(applicant=request.user, job=job)

            #  Send email confirmation
            send_mail(
                subject="Application Submitted Successfully",
                message=f"Dear {request.user.username},\n\nYou applied to: {job.title}.",
                from_email="noreply@jobconnect.com",
                recipient_list=[application.contact_email],  # assuming this field exists
                fail_silently=True,
            )

            return Response(ApplicationSerializer(application).data, status=201)

        return Response(serializer.errors, status=400)
