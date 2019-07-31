from rest_framework.generics import get_object_or_404

from custom_auth import roles
from custom_auth.models import UserCompanyThrough
from custom_auth.serializers import UserCompanyThroughSerializer
from base.views import RetrieveCreateUpdateDestroyView
from .models import Company
from .serializers import CompanySerializer


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
        data = self.get_data()

        # The serializer will check that the objects exists,
        # returning a 400 when it doesn't exist. Therefore
        # we handle the arguments manually, returning a 404 instead
        if 'company_id' in data and 'user_id' in data:
            company_id = data['company_id']
            user_id = data['user_id']
            return get_object_or_404(self.get_queryset(), company=company_id, user=user_id)
        else:
            # We let the serializer handle creating the error
            serializer = self.get_serializer_class()(data=data)
            serializer.is_valid(raise_exception=True)
