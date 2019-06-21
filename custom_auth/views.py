from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework import views, mixins, generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer


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
