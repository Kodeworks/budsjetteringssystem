from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema

from .views import Login, UserView, UserByEmailView


# As this view is defined outside out code,
# we have to do this to override API definitions
token_refresh_view = swagger_auto_schema(
    method='post',
    auto_schema=SwaggerAutoSchema,
    responses={'401': 'Invalid token'}
)(TokenRefreshView.as_view())


urlpatterns = [
    path('login/', Login.as_view(), name='login'),
    path('refresh/', token_refresh_view, name='token-refresh'),
    path('', UserView.as_view(), name='user'),
    path('byEmail/', UserByEmailView.as_view(), name='user-by-email'),
]
