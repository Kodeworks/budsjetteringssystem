from django.urls import path

from .views import CompanyView, CompanyUserView


urlpatterns = [
    path('', CompanyView.as_view(), name='company'),
    path('user/', CompanyUserView.as_view(), name='company-add-user'),
]
