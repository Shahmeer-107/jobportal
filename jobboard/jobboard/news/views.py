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
