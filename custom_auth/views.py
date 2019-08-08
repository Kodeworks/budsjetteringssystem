from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.utils import swagger_auto_schema

from base.views import RetrieveCreateUpdateDestroyView, RetrieveView
from .models import User
from .utils import UserToken
from .serializers import UserSerializer, LoginSerializer, UserTokenSerializer


class Login(APIView):
    """Log an user into the system."""
    missing_msg = 'Please provide email/password'
    invalid_msg = 'Invalid email/password'

    @swagger_auto_schema(
        auto_schema=SwaggerAutoSchema,
        request_body=LoginSerializer,
        security=[],
        responses={
            '200': UserTokenSerializer(),
            '400': missing_msg,
            '404': invalid_msg,
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.data['email']
        password = serializer.data['password']

        user = authenticate(email=email, password=password)

        if user:
            serializer = UserTokenSerializer(UserToken(user))
            return Response(serializer.data, status='200')
        else:
            raise NotFound(self.invalid_msg)


class UserMixin:
    company_id_field = None
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


class UserView(UserMixin, RetrieveCreateUpdateDestroyView):
    """Manage the current user."""
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
            serializer = UserTokenSerializer(UserToken(self.user))
            response.data = serializer.data

        return response

    @swagger_auto_schema(security=[], responses={'201': UserTokenSerializer, '401': None, '403': None})
    def post(self, request, *args, **kwargs):
        """
        Create a new user. This doesn't require being logged in,
        and the new user is automatically logged in after creation.
        """
        request.data['companies'] = []
        return super().post(request, *args, **kwargs)


class UserByEmailView(UserMixin, RetrieveView):
    """Get a user by their email."""
    lookup_field = 'email'
