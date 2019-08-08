import logging
from django.test import TestCase
from django.utils.http import urlencode
from django.core import exceptions as django_exceptions
from django.http import Http404
from rest_framework import exceptions as rest_exceptions
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView
from rest_framework_simplejwt import exceptions as jwt_exceptions
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from custom_auth.models import User
from custom_auth.views import Login


class UserTestMixin:
    setup_create_user = False

    user = None
    email = 'test@test.com'
    password = 'password'

    def setUp(self):
        super().setUp()

        if self.setup_create_user:
            self.user = self.create_user()

    def create_user(self, email=None, password=None, save=True):
        user = User(email=email or self.email)
        user.set_password(password or self.password)

        if save:
            user.save()
        return user


class JWTTestCase(UserTestMixin, TestCase):
    setup_login = False

    def setUp(self):
        super().setUp()

        self.factory = APIRequestFactory()
        self.access_token = None
        self.refresh_token = None

        if self.setup_login:
            if not self.user:
                self.user = self.create_user()

            self.force_login()

    def tearDown(self):
        self.factory = None
        self.email = None
        self.password = None
        self.access_token = None
        self.refresh_token = None

    def login(self, email, password):
        response = self.post(Login, {'email': email, 'password': password})
        self.access_token = response.data['access']
        self.refresh_token = response.data['refresh']

    def force_login(self, user=None):
        refresh = RefreshToken.for_user(user or self.user)
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


class ExceptionHandlerTestCase(JWTTestCase):
    class DetailException(Exception):
        def __init__(self, detail):
            self.detail = detail

    def create_view(self, exc):
        """
        Create a temporary view that only casts an exception.

        The exc parameter can be an instance of an exception,
        or a function that raises an exception.
        """
        class ExceptionView(APIView):
            def get(self, *args, **kwargs):
                if isinstance(exc, Exception):
                    raise exc
                else:
                    exc()

        return ExceptionView

    def force_error(self, exc):
        """Shorthand for `create_view()` and `get()`"""
        return self.get(self.create_view(exc))

    def validation_error_helper(self, exc_class, code=None):
        msg = 'Error'
        response = self.force_error(
            exc_class(msg, code=code)
        )
        expected = {
            'error_type': 'form_error',
            'errors': [{'code': 'invalid', 'detail': msg}],
            'field_errors': {},
        }
        self.assertEqual(response.status_code, 400, msg=response.data)
        self.assertDictEqual(response.data, expected, msg=response.data)

        response = self.force_error(
            exc_class([msg, msg], code=code)
        )
        expected = {
            'error_type': 'form_error',
            'errors': [
                {'code': 'invalid', 'detail': msg},
                {'code': 'invalid', 'detail': msg},
            ],
            'field_errors': {},
        }
        self.assertEqual(response.status_code, 400, msg=response.data)
        self.assertDictEqual(response.data, expected, msg=response.data)

        field = 'date'
        field_msg = 'field error'
        non_field_msg = 'non field error'
        response = self.force_error(
            exc_class({
                field: [field_msg],
                'non_field_errors': [non_field_msg],
            }, code=code)
        )
        expected = {
            'error_type': 'form_error',
            'errors': [
                {'code': 'invalid', 'detail': non_field_msg},
            ],
            'field_errors': {
                field: [{'code': 'invalid', 'detail': field_msg}]
            },
        }
        self.assertEqual(response.status_code, 400, msg=response.data)
        self.assertDictEqual(response.data, expected, msg=response.data)

    def test_rest_validation_error(self):
        self.validation_error_helper(rest_exceptions.ValidationError)

    def test_django_validation_error(self):
        self.validation_error_helper(django_exceptions.ValidationError)

    def test_jwt_errors(self):
        msg = 'Token error'
        response = self.force_error(
            jwt_exceptions.InvalidToken(msg)
        )
        expected = {
            'error_type': 'jwt_error',
            'errors': [
                {'code': 'token_not_valid', 'detail': msg},
            ],
            'field_errors': {},
        }
        self.assertEqual(response.status_code, 401, msg=response.data)
        self.assertDictEqual(response.data, expected, msg=response.data)

    def test_http_404_error(self):
        msg = 'Object not found'
        response = self.force_error(
            Http404(msg)
        )
        expected = {
            'error_type': 'error',
            'errors': [
                {'code': 'not_found', 'detail': msg},
            ],
            'field_errors': {},
        }
        self.assertEqual(response.status_code, 404, msg=response.data)
        self.assertDictEqual(response.data, expected, msg=response.data)

    def test_misc_exceptions(self):
        msg = 'Object not found'
        code = 'test'

        response = self.force_error(
            self.DetailException(rest_exceptions.ErrorDetail(msg, code))
        )
        expected = {
            'error_type': 'error',
            'errors': [
                {'code': code, 'detail': msg},
            ],
            'field_errors': {},
        }
        self.assertEqual(response.status_code, 400, msg=response.data)
        self.assertDictEqual(response.data, expected, msg=response.data)

        response = self.force_error(
            self.DetailException([
                rest_exceptions.ErrorDetail(msg, code),
                rest_exceptions.ErrorDetail(msg, code),
            ])
        )
        expected = {
            'error_type': 'error',
            'errors': [
                {'code': code, 'detail': msg},
                {'code': code, 'detail': msg},
            ],
            'field_errors': {},
        }
        self.assertEqual(response.status_code, 400, msg=response.data)
        self.assertDictEqual(response.data, expected, msg=response.data)

        # Disable logging, so we don't spam the test log
        logging.disable(logging.CRITICAL)
        response = self.force_error(
            self.DetailException([
                rest_exceptions.ErrorDetail(msg, code),
                "should be an ErrorDetail",
            ])
        )
        logging.disable(logging.NOTSET)

        self.assertEqual(response.status_code, 500, msg=response.data)

    def test_invalid_exceptions(self):
        msg = 'Token error'

        # Disable logging, so we don't spam the test log
        logging.disable(logging.CRITICAL)
        response = self.force_error(
            Exception(msg)
        )
        logging.disable(logging.NOTSET)

        expected = {
            'error_type': 'error',
            'errors': [
                {'code': 'server_error', 'detail': 'Internal server error.'},
            ],
            'field_errors': {},
        }
        self.assertEqual(response.status_code, 500, msg=response.data)
        self.assertDictEqual(response.data, expected, msg=response.data)
