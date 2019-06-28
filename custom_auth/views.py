from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from base.views import RetrieveCreateUpdateDestroyView, RetrieveView
from .models import User
from .serializers import UserSerializer


class Login(APIView):
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
