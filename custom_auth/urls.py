from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import Login, UserView, UserByEmailView


urlpatterns = [
    path('login/', Login.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('', UserView.as_view(), name='user'),
    path('byEmail/', UserByEmailView.as_view(), name='user-by-email'),
]
