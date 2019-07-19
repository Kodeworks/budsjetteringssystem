from django.urls import path
from transaction import views

urlpatterns = [
    path('', views.RecurringView.as_view(), name='recurring'),
    path('all/', views.RecurringAllView.as_view(), name='recurring-all'),
    path('active/', views.RecurringActive.as_view(), name='recurring-active'),
    path('byDate/', views.RecurringByDate.as_view(), name='recurring-by-date'),
    path('byDateRange/', views.RecurringByDateRange.as_view(), name='recurring-by-date-range'),
]
