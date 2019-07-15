from django.urls import path

from .views import BankBalanceView, BankBalanceByDateView, BankBalanceByDateRangeView


urlpatterns = [
    path('bank/', BankBalanceView.as_view(), name='bank-balance'),
    path('bank/byDate/', BankBalanceByDateView.as_view(), name='bank-balance-by-date'),
    path('bank/byDateRange/', BankBalanceByDateRangeView.as_view(), name='bank-balance-by-date-range'),
]
