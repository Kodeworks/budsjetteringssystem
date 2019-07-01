from django.test import TestCase
from django.utils.http import urlencode
from rest_framework.test import APIRequestFactory
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from custom_auth.models import User
from custom_auth.views import Login


class JWTTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.email = 'test@test.com'
        self.password = 'password'
        self.access_token = None
        self.refresh_token = None

    def tearDown(self):
        self.factory = None
        self.email = None
        self.password = None
        self.access_token = None
        self.refresh_token = None

    def create_user(self, email=None, password=None, save=True):
        """Helper method"""
        user = User(email=(email or self.email))
        user.set_password(password or self.password)
        if save:
            user.save()
        return user

    def login(self, email, password):
        response = self.post(Login, {'email': email, 'password': password})
        self.access_token = response.data['access']
        self.refresh_token = response.data['refresh']

    def force_login(self, user):
        refresh = RefreshToken.for_user(user)
        self.refresh_token = str(refresh)
        self.access_token = str(refresh.access_token)

    def logout(self):
        self.access_token = None
        self.refresh_token = None

    def refresh_token(self):
        response = self.post(TokenRefreshView, {'refresh': self.refresh_token})
        self.access_token = response.data['access']

    def format_arguments(self, method, data, url):
        # The rest framework doesn't allow both query parameters and
        # post data, so if it's a GET request we encode the data in the url
        if method == 'GET':
            # Get the name of the argument in the url
            existing_params = [item.split('=')[0] for item in url.split('?')[-1].split('&')]

            for name in data:
                if name not in existing_params:
                    if '?' not in url:
                        url += '?'
                    else:
                        url += '&'

                    url += urlencode({name: data[name]})

            data = {}

        return data, url

    def perform_request(self, method, view, data={}, url='', factory=None, **extra):
        if self.access_token:
            extra['HTTP_AUTHORIZATION'] = f'Bearer {self.access_token}'

        data, url = self.format_arguments(method, data, url)
        factory = factory or self.factory
        request = getattr(factory, method.lower())(url, data, format='json', **extra)
        response = view.as_view()(request)
        response.render()
        return response

    def get(self, *args, **kwargs):
        return self.perform_request('GET', *args, **kwargs)

    def post(self, *args, **kwargs):
        return self.perform_request('POST', *args, **kwargs)

    def put(self, *args, **kwargs):
        return self.perform_request('PUT', *args, **kwargs)

    def delete(self, *args, **kwargs):
        return self.perform_request('DELETE', *args, **kwargs)
