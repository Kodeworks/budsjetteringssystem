from django.urls import path

from . import views


urlpatterns = [
    path('', views.MonthView.as_view(), name='month'),
]
