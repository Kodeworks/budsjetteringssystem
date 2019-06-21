from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CompanyView, CompanyAddUserView, CompanyRemoveUserView


urlpatterns = [
    path('', CompanyView.as_view(), name='company'),
    path('addUser/', CompanyAddUserView.as_view(), name='company-add-user'),
    path('removeUser/', CompanyRemoveUserView.as_view(), name='company-remove-user'),
]
