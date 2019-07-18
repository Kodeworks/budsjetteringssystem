from django.urls import path
from transaction import views

urlpatterns = [
    path('', views.TransactionView.as_view(), name='transaction'),
    path('all/', views.TransactionAllView.as_view(), name='transaction-all'),
    path('byDate/', views.TransactionByDateView.as_view(), name='transaction-by-date'),
    path('byDateRange/', views.TransactionByDateRangeView.as_view(), name='transaction-by-date-range'),
    path('income/all/', views.TransactionIncomeAllView.as_view(), name='transaction-income-all'),
    path('expense/all/', views.TransactionExpenseAllView.as_view(), name='transaction-expense-all'),
]