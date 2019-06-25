from django.db.utils import IntegrityError

from rest_framework.response import Response

from custom_auth import roles
from custom_auth.models import UserCompanyThrough
from custom_auth.views import CompanyAccessView, RetrieveCreateUpdateDestroyView
from .models import Company
from .serializers import CompanySerializer


class CompanyView(RetrieveCreateUpdateDestroyView):
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


class CompanyAddUserView(CompanyAccessView):
    company_access = {
        'POST': roles.OWNER,
    }

    def post(self, request, *args, **kwargs):
        company_id = self.get_company_id(request)
        user_id = request.data['user_id']

        try:
            UserCompanyThrough.objects.create(user_id=user_id, company_id=company_id)
        except IntegrityError:
            return Response({'detail': 'User not found'}, status='404')

        return Response(status='200')


class CompanyRemoveUserView(CompanyAccessView):
    company_access = {
        'POST': roles.OWNER,
    }

    def post(self, request, *args, **kwargs):
        company_id = self.get_company_id(request)
        user_id = request.data['user_id']

        try:
            UserCompanyThrough.objects.get(user_id=user_id, company_id=company_id).delete()
        except UserCompanyThrough.DoesNotExist:
            return Response({'detail': 'The user is not member of this company'}, status='404')

        return Response(status='200')


class CompanySetRoleView(CompanyAccessView):
    company_access = {
        'POST': roles.OWNER,
    }

    def post(self, request, *args, **kwargs):
        company_id = self.get_company_id(request)
        user_id = request.data['user_id']

        role = roles.get_role(request.data['role'])

        queryset = UserCompanyThrough.objects.filter(user=user_id, company=company_id)
        if queryset.exists():
            queryset.update(role=role)
        else:
            return Response({'detail': 'The user is not member of this company'}, status='404')

        return Response(status='200')
