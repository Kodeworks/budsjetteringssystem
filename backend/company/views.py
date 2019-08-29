from rest_framework.generics import get_object_or_404
from rest_framework.exceptions import ParseError
from drf_yasg.utils import swagger_auto_schema

from custom_auth import roles
from custom_auth.models import User, UserCompanyThrough
from custom_auth.serializers import UserCompanyThroughSerializer
from base.views import RetrieveCreateUpdateDestroyView
from .models import Company
from .serializers import CompanySerializer, AddUserToCompanySerializer


class CompanyView(RetrieveCreateUpdateDestroyView):
    """Manage a company."""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    lookup_arg_field = 'company_id'
    company_access = {
        'GET': roles.REPORTER,
        'POST': None,
        'PUT': roles.OWNER,
        'DELETE': roles.OWNER,
    }

    def perform_create(self, serializer):
        company = serializer.save()
        self.request.user.companies.add(company, through_defaults={'role': roles.OWNER})


class CompanyUserView(RetrieveCreateUpdateDestroyView):
    """Manage users in a company."""
    # A little trick to add 'user_id' to the API spec
    lookup_field = 'user_id'
    serializer_class = UserCompanyThroughSerializer
    queryset = UserCompanyThrough.objects.all()
    company_access = {
        'POST': roles.OWNER,
        'PUT': roles.OWNER,
        'DELETE': roles.OWNER,
    }

    def get_object(self):
        request_serializer = self.serializer_class(data=self.get_data())
        request_serializer.is_valid(raise_exception=True)

        company_id = self.get_company_id()
        user_id = request_serializer.data['user_id']
        return get_object_or_404(self.get_queryset(), company=company_id, user_id=user_id)

    @swagger_auto_schema(
        request_body=AddUserToCompanySerializer,
        responses={'201': serializer_class},
    )
    def post(self, request, *args, **kwargs):
        serializer = AddUserToCompanySerializer(data=self.get_data())
        serializer.is_valid(raise_exception=True)

        try:
            request.data['user_id'] = User.objects.get(email=serializer.data['email']).pk
        except User.DoesNotExist:
            raise ParseError('Invalid email')

        return super().post(request, *args, **kwargs)
