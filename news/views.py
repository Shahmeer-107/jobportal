from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from django.conf import settings

@api_view(['GET'])
def fetch_news(request):
    category = request.GET.get("category", "technology")
    url = f"https://newsapi.org/v2/top-headlines?category={category}&country=us&apiKey={settings.NEWS_API_KEY}"
    print(f"Fetching news from URL: {url}")
    
    response = requests.get(url)
    data = response.json()

    if response.status_code != 200:
        return Response({"error": data.get("message")}, status=response.status_code)

    return Response(data)





from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from datetime import date, timedelta
from django.contrib.auth import get_user_model
from jobs.models import Job


@api_view(["GET"])
def fetch_remotive_jobs(request):

    User = get_user_model()

    company = User.objects.get(
        email="shahmeershaami110+3@gmail.com"
    )

    url = "https://remotive.com/api/remote-jobs"

    response = requests.get(url)
    data = response.json()

    count = 0

    for job in data["jobs"][:5]:

        Job.objects.create(
            title=job.get("title", "No Title")[:255],
            description=job.get("description", ""),
            company_full_name=job.get("company_name", "")[:255],
            category=job.get("category", "")[:100],
            degree_required="Bachelor",
            job_type="permanent",
            work_type="remote",
            experience_level="mid",
            salary_min=500,
            salary_max=2000,
            currency="USD",
            skills=",".join(job.get("tags", [])),
            responsibilities=job.get("description", ""),
            location=job.get(
                "candidate_required_location", ""
            )[:255],
            deadline=date.today() + timedelta(days=30),
            company=company,
            status="open",
            source="external",
            external_id=str(job.get("id")),
        )

        count += 1

    return Response({
        "message": f"{count} jobs imported successfully"
    })