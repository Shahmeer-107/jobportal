from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    JobViewSet,
    CompanyApplicationsListAPIView,
    CompanyApplicationUpdateAPIView
)

router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='jobs')

urlpatterns = [
    path('', include(router.urls)),

    # ✅ Company Applications APIs
    path(
        'company/applications/',
        CompanyApplicationsListAPIView.as_view(),
        name='company-applications-list'
    ),

    path(
        'company/applications/<int:id>/',
        CompanyApplicationUpdateAPIView.as_view(),
        name='company-application-update'
    ),
]