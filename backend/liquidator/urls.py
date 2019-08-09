"""liquidator URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

import custom_auth.urls
import company.urls
import transaction.urls.transaction
import transaction.urls.recurring
import balance.urls
import balance.month_urls


schema_view = get_schema_view(
    openapi.Info(
        title='Liquidator API',
        default_version='1.0.0',
        license=openapi.License(name='MIT License'),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


# The url patterns behind a common prefix
api_patterns = [
    path('admin/', admin.site.urls),
    path('user/', include(custom_auth.urls)),
    path('company/', include(company.urls)),
    path('transaction/', include(transaction.urls.transaction)),
    path('recurring/', include(transaction.urls.recurring)),
    path('balance/', include(balance.urls)),
    path('month/', include(balance.month_urls)),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]


# The root url patterns
urlpatterns = [
    path('api/', include(api_patterns)),
]
