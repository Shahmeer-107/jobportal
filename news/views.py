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




# import requests
# from datetime import date, timedelta
# from jobs.models import Job
# from django.contrib.auth import get_user_model

# # Get the user (company) who will own these jobs
# User = get_user_model()
# company = User.objects.get(email="shahmeershaami110+3@gmail.com")

# # Remotive API URL
# url = "https://remotive.com/api/remote-jobs"
# response = requests.get(url)
# data = response.json()

# # Loop through first 20 jobs only
# for job in data["jobs"][:20]:
#  Job.objects.create(
#     title=job.get("title", "No Title")[:255],
#     description=job.get("description", "No Description"),
#     company_full_name=job.get("company_name", "External Company")[:255],
#     category=job.get("category", "")[:100],
#     degree_required="Bachelor"[:100],
#     tags=",".join(job.get("tags", []))[:255],
#     job_type="permanent",
#     work_type="remote",
#     experience_level="mid",
#     salary_min=500,
#     salary_max=2000,
#     currency="USD"[:10],
#     skills=",".join(job.get("tags", [])),  # TextField, safe
#     responsibilities=job.get("description", ""),  # TextField, safe
#     location=job.get("candidate_required_location", "")[:255],
#     deadline=date.today() + timedelta(days=30),
#     company=company,
#     status="open",
#     source="external",
#     external_id=str(job.get("id"))[:255],
# )

# print("✅ 5 jobs successfully added to your database!")