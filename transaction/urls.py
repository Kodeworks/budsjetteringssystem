from django.urls import path
from .views import TransactionAllView

urlpatterns = [
    path('all/', TransactionAllView.as_view(), name='transaction-all')
]