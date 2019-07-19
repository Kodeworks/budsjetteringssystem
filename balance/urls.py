from django.urls import path

from . import views


urlpatterns = [
    path('', views.BalanceView.as_view(), name='balance'),
    path('byDateRange/', views.BalanceByDateRangeView.as_view(), name='balance-by-date-range'),
    path('bank/', views.BankBalanceView.as_view(), name='bank-balance'),
    path('bank/byDate/', views.BankBalanceByDateView.as_view(), name='bank-balance-by-date'),
    path('bank/byDateRange/', views.BankBalanceByDateRangeView.as_view(), name='bank-balance-by-date-range'),
]
