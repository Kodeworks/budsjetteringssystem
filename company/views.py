from django.db.utils import IntegrityError

from rest_framework.response import Response

from custom_auth import roles
from custom_auth.models import UserCompanyThrough
from base.views import CompanyAccessView, RetrieveCreateUpdateDestroyView
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


class CompanyUserMixin:
    company_access = {
        'POST': roles.OWNER,
    }

    def post(self, request, *args, **kwargs):
        company_id = self.get_company_id()
        user_id = request.data['user_id']

        if 'role' in self.request.data and self.request.data['role']:
            role = roles.get_role(request.data['role'])
        else:
            role = None

        return self.handle_user(company_id, user_id, role)


class CompanyAddUserView(CompanyUserMixin, CompanyAccessView):
    def handle_user(self, company_id, user_id, role):
        data = {'company_id': company_id, 'user_id': user_id}
        if role:
            data['role'] = role

        try:
            UserCompanyThrough.objects.create(**data)
        except IntegrityError:
            return Response({'detail': 'User not found'}, status='404')

        return Response(status='200')


class CompanyRemoveUserView(CompanyUserMixin, CompanyAccessView):
    def handle_user(self, company_id, user_id, role):
        try:
            UserCompanyThrough.objects.get(user_id=user_id, company_id=company_id).delete()
        except UserCompanyThrough.DoesNotExist:
            return Response({'detail': 'The user is not member of this company'}, status='404')

        return Response(status='200')


class CompanySetRoleView(CompanyUserMixin, CompanyAccessView):
    def handle_user(self, company_id, user_id, role):
        queryset = UserCompanyThrough.objects.filter(user=user_id, company=company_id)

        if queryset.exists():
            queryset.update(role=role)
        else:
            return Response({'detail': 'The user is not member of this company'}, status='404')

        return Response(status='200')
