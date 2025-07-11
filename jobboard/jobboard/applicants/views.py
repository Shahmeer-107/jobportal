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

        if job.deadline and job.deadline < timezone.now().date():

            return Response({"error": "Deadline passed"}, status=400)

        if Application.objects.filter(applicant=request.user, job=job).exists():
            return Response({"error": "You already applied to this job"}, status=400)

        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            application = serializer.save(applicant=request.user, job=job)

            print("📨 Sending email to:", application.contact_email)


            send_mail(
                subject="Your Job Application Has Been Successfully Submitted",
                message=f"""
Dear {application.full_name},

Thank you for applying to the position of {job.title}.

We have successfully received your application. Our recruitment team will carefully review your profile and contact you if your qualifications match our requirements.

For further updates or instructions, please check your email regularly.

If you have any questions, feel free to reply to this email.

Best regards,  
Sohail Shahzad  
HR Department
""",
            from_email="sohailshahzad500@gmail.com",
            recipient_list=[application.contact_email],
            fail_silently=True,
)

            return Response(ApplicationSerializer(application).data, status=201)

        return Response(serializer.errors, status=400)
