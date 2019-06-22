from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from . import views, roles
from .models import User


class JWTTestCase(TestCase):
    access_token = None
    refresh_token = None

    def setUp(self):
        self.factory = APIRequestFactory()

    def login(self, email, password):
        response = self.post(views.Login, {'email': email, 'password': password})
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

    def perform_request(self, method, view, data={}, url='', extra={}, factory=None):
        if self.access_token:
            extra['HTTP_AUTHORIZATION'] = f'Bearer {self.access_token}'

        factory = factory or self.factory
        request = getattr(factory, method)(url, data, format='json', **extra)
        response = view.as_view()(request)
        response.render()
        return response

    def get(self, *args, **kwargs):
        return self.perform_request('get', *args, **kwargs)

    def post(self, *args, **kwargs):
        return self.perform_request('post', *args, **kwargs)

    def put(self, *args, **kwargs):
        return self.perform_request('put', *args, **kwargs)

    def delete(self, *args, **kwargs):
        return self.perform_request('delete', *args, **kwargs)


class AuthenticationTest(JWTTestCase):
    def setUp(self):
        super().setUp()
        self.email = 'test@test.com'
        self.password = 'password'

        self.user = User(email=self.email)
        self.user.set_password(self.password)
        self.user.save()

    def test_correct_login(self):
        response = self.post(views.Login, {'email': self.email, 'password': self.password})
        self.assertEquals(response.status_code, 200, msg=response.content)

    def test_incorrect_login(self):
        response = self.post(views.Login, {'email': self.email, 'password': 'wrong'})
        self.assertEquals(response.status_code, 400, msg=response.content)

    def test_correct_JWT_refresh(self):
        response = self.post(views.Login, {'email': self.email, 'password': self.password})
        access_token = response.data['access']
        refresh_token = response.data['refresh']

        response = self.post(TokenRefreshView, {'refresh': refresh_token})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertNotEqual(response.data['access'], access_token)

    def test_incorrect_JWT_refresh(self):
        response = self.post(views.Login, {'email': self.email, 'password': self.password})
        refresh_token = response.data['refresh']

        response = self.post(TokenRefreshView, {'refresh': f'{refresh_token}a'})
        self.assertEquals(response.status_code, 401, msg=response.content)


class UserTest(JWTTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.email = 'test@test.com'
        self.password = 'password'

    def create_user(self, email=None, password=None):
        """Helper method"""
        user = User(email=(email or self.email))
        user.set_password(password or self.password)
        user.save()
        return user

    def test_not_authenticated(self):
        # Should only be able to create a new user without logging in
        user = self.create_user()

        response = self.get(views.UserView, {'id': user.id})
        self.assertEquals(response.status_code, 401, msg=response.content)

        response = self.put(views.UserView, {'id': user.id, 'email': user.email})
        self.assertEquals(response.status_code, 401, msg=response.content)

        response = self.delete(views.UserView)
        self.assertEquals(response.status_code, 401, msg=response.content)

    def test_create_user(self):
        response = self.post(views.UserView, {'email': self.email, 'password': self.password})
        self.assertEquals(response.status_code, 201, msg=response.content)
        self.assertEquals(response.data['email'], self.email, msg=response.content)

    def test_update_user(self):
        user = self.create_user()
        self.force_login(user)

        first_name = "Test"
        last_name = "Testing"
        data = {'email': user.email, 'first_name': first_name, 'last_name': last_name}
        response = self.put(views.UserView, data)

        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['email'], self.email, msg=response.content)
        self.assertEquals(response.data['first_name'], first_name, msg=response.content)
        self.assertEquals(response.data['last_name'], last_name, msg=response.content)

        user = User.objects.get(pk=user.pk)
        self.assertEquals(user.first_name, first_name, msg=response.content)
        self.assertEquals(user.last_name, last_name, msg=response.content)

    def test_get_user(self):
        user = self.create_user()
        self.force_login(user)

        response = self.get(views.UserView, {'id': user.id})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['email'], self.email, msg=response.content)

    def test_get_user_by_email(self):
        user = self.create_user()
        self.force_login(user)

        response = self.get(views.UserByEmailView, {'email': user.email})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['id'], user.id, msg=response.content)

    def test_delete_user(self):
        user = self.create_user()
        self.force_login(user)

        response = self.delete(views.UserView)
        self.assertEquals(response.status_code, 204, msg=response.content)
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(pk=user.pk)


class RoleTestCase(TestCase):
    def test_is_equivalent(self):
        self.assertTrue(roles.is_equivalent(roles.REPORTER, roles.REPORTER))
        self.assertFalse(roles.is_equivalent(roles.REPORTER, roles.USER))
        self.assertFalse(roles.is_equivalent(roles.REPORTER, roles.OWNER))

        self.assertTrue(roles.is_equivalent(roles.USER, roles.REPORTER))
        self.assertTrue(roles.is_equivalent(roles.USER, roles.USER))
        self.assertFalse(roles.is_equivalent(roles.USER, roles.OWNER))

        self.assertTrue(roles.is_equivalent(roles.OWNER, roles.REPORTER))
        self.assertTrue(roles.is_equivalent(roles.OWNER, roles.USER))
        self.assertTrue(roles.is_equivalent(roles.OWNER, roles.OWNER))

    def test_get_name(self):
        self.assertEqual(roles.get_name(roles.REPORTER), 'Reporter')
        self.assertIsNone(roles.get_name('Dummy'))

    def test_get_role(self):
        self.assertEqual(roles.get_role('Owner'), roles.OWNER)
        self.assertEqual(roles.get_role('OW'), roles.OWNER)
        self.assertIsNone(roles.get_role('Dummy'))
