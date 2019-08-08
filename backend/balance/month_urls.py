from django.urls import path

from . import views


urlpatterns = [
    path('', views.MonthView.as_view(), name='month'),
    path('byDateRange/', views.MonthByDateRangeView.as_view(), name='month-by-date-range'),
]
