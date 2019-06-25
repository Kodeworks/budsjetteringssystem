from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework import views, mixins, generics, permissions
from rest_framework.exceptions import PermissionDenied, ParseError
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer
from . import roles


class CompanyAccessView(generics.GenericAPIView):
    """
    Checks that the user has access to the the requested operation on/for a company.

    The role required to perform an action is given by the `company_access` attribute.
    The role is set for each type of HTTP method. This can be overwritten in subclasses.
    """
    permission_classes = (permissions.IsAuthenticated,)
    company_id_field = 'company_id'
    company_access = {
        'GET': roles.REPORTER,
        'POST': roles.USER,
        'PUT': roles.USER,
        'DELETE': roles.USER,
    }
    permissions = {}

    def get_permissions(self):
        """
        Get the permissions given by `permission_classes`,
        unless overriden in `permissions` for the current method.
        """
        if self.request.method in self.permissions:
            permissions = self.permissions[self.request.method]
            if permissions:
                permissions = [permission() for permission in permissions]
                return permissions
            else:
                return []
        else:
            return super().get_permissions()

    def get_company_access(self):
        """
        Return the roles required for the different HTTP methods.

        If a subclass redifines `company_access` it is merged with
        `CompanyAccessView.company_access`.
        """
        return {
            **CompanyAccessView.company_access,
            **self.company_access,
        }

    def get_data(self, request):
        """Get the data/parameters for the request."""
        # Merge POST and query data. Query data is always returned as a list,
        # so if it's only one element we take it out of the list
        request.data.update({k: v[0] if len(v) == 1 else v for k, v in request.query_params.lists()})
        return request.data

    def get_company_id(self, request):
        """
        Get the ID of the current company.

        The ID is passed in the field given by `company_id_field`
        in either query or post data, depending on the type of request.

        If no ID is passed None is returned.
        """
        data = self.get_data(request)

        if self.company_id_field in data:
            return data[self.company_id_field]
        else:
            return None

    def check_company_role(self, request, *args, **kwargs):
        """Check that the user has permission to do this action on the current company."""
        company_id = self.get_company_id(request)
        required_role = self.get_company_access()[request.method]

        if required_role and not request.user.has_role(company_id, required_role):
            raise PermissionDenied("You don't have access to do this operation on this company")

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_company_role(request, *args, **kwargs)


class SingleObjectQueryOrDataMixin:
    """Allows pk for a object to be sent as a query or POST parameter, instead of through the URL."""
    lookup_query_field = None
    lookup_data_field = None
    lookup_arg_field = None

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        if self.request.method == 'GET':
            field = self.lookup_query_field or self.lookup_arg_field or self.lookup_field
            data = self.request.query_params
        else:
            field = self.lookup_data_field or self.lookup_arg_field or self.lookup_field
            data = self.request.data

        if field not in data:
            raise ParseError(f'Missing argument "{field}"')
        value = data[field]

        obj = get_object_or_404(queryset, **{self.lookup_field: value})
        self.check_object_permissions(self.request, obj)
        return obj


class RetrieveView(SingleObjectQueryOrDataMixin, mixins.RetrieveModelMixin, CompanyAccessView):
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class RetrieveCreateUpdateDestroyView(SingleObjectQueryOrDataMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin,
                                      mixins.UpdateModelMixin, mixins.DestroyModelMixin, CompanyAccessView):
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class Login(views.APIView):
    def post(self, request, *args, **kwargs):
        if not request.data:
            return Response({'error': 'Please provide email/password'}, status="400")

        email = request.data['email']
        password = request.data['password']

        user = authenticate(email=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)

            return Response(
                {'refresh': str(refresh), 'access': str(refresh.access_token), 'user': serializer.data},
                status='200',
            )
        else:
            return Response({'detail': 'Invalid email/password'}, status='400')


class UserMixin:
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'
    company_access = {
        'GET': None,
    }

    def check_company_role(self, request, *args, **kwargs):
        """Let a user manage themselves regardless of their role."""
        data = self.get_data(request)

        if request.method not in ['POST', 'DELETE', 'PUT'] \
           and data[self.lookup_field] != getattr(request.user, self.lookup_field):
            super().check_company_role(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        request.data['companies'] = []
        return super().post(request, *args, **kwargs)


class UserView(UserMixin, RetrieveCreateUpdateDestroyView):
    permissions = {
        'POST': None,
    }
    user = None

    def get_object(self):
        # A user can only update or delete itself
        if self.request.method in ['DELETE', 'PUT']:
            return self.request.user
        else:
            return super().get_object()

    def perform_create(self, serializer):
        self.user = serializer.save()

    def create(self, *args, **kwargs):
        response = super().create(*args, **kwargs)
        if self.user:
            refresh = RefreshToken.for_user(self.user)
            response.data = {
                'user': response.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

        return response


class UserByEmailView(UserMixin, RetrieveView):
    lookup_field = 'email'
