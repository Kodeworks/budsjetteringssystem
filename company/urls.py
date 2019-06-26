from django.urls import path

from .views import CompanyView, CompanyAddUserView, CompanyRemoveUserView, CompanySetRoleView


urlpatterns = [
    path('', CompanyView.as_view(), name='company'),
    path('addUser/', CompanyAddUserView.as_view(), name='company-add-user'),
    path('removeUser/', CompanyRemoveUserView.as_view(), name='company-remove-user'),
    path('setRole/', CompanySetRoleView.as_view(), name='company-set-role'),
]
