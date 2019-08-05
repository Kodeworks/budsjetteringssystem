from django.test import TestCase
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView

from base.views import CompanyAccessView
from base.tests import JWTTestCase
from company.models import Company

from . import views, roles
from .models import User, UserCompanyThrough


class AuthenticationTestCase(JWTTestCase):
    def setUp(self):
        super().setUp()
        self.user = self.create_user()

    def test_correct_login(self):
        response = self.post(views.Login, {'email': self.email, 'password': self.password})
        self.assertEquals(response.status_code, 200, msg=response.content)

    def test_incorrect_login(self):
        response = self.post(views.Login, {'email': self.email, 'password': 'wrong'})
        self.assertEquals(response.status_code, 404, msg=response.content)

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


class UserViewTestCase(JWTTestCase):
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
        response = self.post(views.UserView, {'email': self.email})
        self.assertEquals(response.status_code, 400, msg=response.content)

        response = self.post(views.UserView, {'email': self.email, 'password': self.password})
        self.assertEquals(response.status_code, 201, msg=response.content)
        self.assertEquals(response.data['user']['email'], self.email, msg=response.content)
        self.assertIn('refresh', response.data, msg=response.content)
        self.assertIn('access', response.data, msg=response.content)

    def test_update_user(self):
        user = self.create_user()
        user2 = self.create_user('user2@test.com', 'pass2')
        self.force_login(user)

        first_name = "Test"
        last_name = "Testing"

        # A user can only update itself, so the id parameter should be disregarded
        data = {'id': user2.id, 'email': user.email, 'first_name': first_name, 'last_name': last_name}
        response = self.put(views.UserView, data)
        expected = {
            'id': user.id,
            'email': self.email,
            'first_name': first_name,
            'last_name': last_name,
            'companies': [],
        }
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data, expected, msg=response.content)

        data = {'id': user2.id, 'email': user.email, 'first_name': first_name,
                'last_name': last_name, 'password': 'pass3'}
        response = self.put(views.UserView, data)
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data, expected, msg=response.content)

        # Check that we updated the correct user
        user = User.objects.get(pk=user.pk)
        self.assertEquals(user.first_name, first_name, msg=response.content)
        self.assertEquals(user.last_name, last_name, msg=response.content)
        self.assertTrue(user.check_password('pass3'))

        user2 = User.objects.get(pk=user2.pk)
        self.assertNotEquals(user2.first_name, first_name, msg=response.content)
        self.assertNotEquals(user2.last_name, last_name, msg=response.content)

    def test_get_user(self):
        user = self.create_user()
        self.force_login(user)

        response = self.get(views.UserView, {'id': user.id})
        expected = {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'companies': [],
        }
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data, expected, msg=response.content)

    def test_get_user_by_email(self):
        user = self.create_user()
        self.force_login(user)

        response = self.get(views.UserByEmailView, {'email': user.email})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['id'], user.id, msg=response.content)

    def test_delete_user(self):
        user = self.create_user()
        user2 = self.create_user('user2@test.com', 'pass2')
        self.force_login(user)

        # Delete deletes the current user, so the id parameter should be ignored
        response = self.delete(views.UserView, data={'id': user2.id})
        self.assertEquals(response.status_code, 204, msg=response.content)
        self.assertTrue(User.objects.filter(pk=user2.pk).exists())
        with self.assertRaises(User.DoesNotExist):
            User.objects.get(pk=user.pk)


class UserTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@test.com', password='password',
                                             first_name='Test', last_name='Testing')
        self.company = Company.objects.create(name='Test inc', org_nr='13239193129')

    def test_get_role(self):
        UserCompanyThrough.objects.create(user=self.user, company=self.company, role=roles.REPORTER)
        self.assertEqual(self.user.get_role(self.company.pk), roles.REPORTER)

        UserCompanyThrough.objects.update(user=self.user, company=self.company, role=roles.OWNER)
        self.assertEqual(self.user.get_role(self.company.pk), roles.OWNER)

    def test_has_role(self):
        UserCompanyThrough.objects.create(user=self.user, company=self.company, role=roles.USER)

        self.assertTrue(self.user.has_role(self.company.pk, roles.REPORTER))
        self.assertTrue(self.user.has_role(self.company.pk, roles.USER))
        self.assertFalse(self.user.has_role(self.company.pk, roles.OWNER))

        UserCompanyThrough.objects.update(user=self.user, company=self.company, role=roles.OWNER)
        self.assertTrue(self.user.has_role(self.company.pk, roles.OWNER))


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


class CompanyAccessViewTest(JWTTestCase):
    class TestView(CompanyAccessView):
        company_access = {
            'GET': None,
            'POST': roles.REPORTER,
            'PUT': roles.USER,
            'DELETE': roles.OWNER,
        }
        permissions = {
            'GET': None,
        }

        def get(self, *args, **kwargs):
            return Response(status='200')

        def post(self, *args, **kwargs):
            return Response(status='200')

        def put(self, *args, **kwargs):
            return Response(status='200')

        def delete(self, *args, **kwargs):
            return Response(status='200')

    def setUp(self):
        super().setUp()
        self.company = Company.objects.create(name='Test inc.', org_nr='47484929')

        self.reporter = self.create_user('Reporter', 'reporter@test.com')
        UserCompanyThrough.objects.create(company=self.company, user=self.reporter, role=roles.REPORTER)

        self.user = self.create_user('User', 'user@test.com')
        UserCompanyThrough.objects.create(company=self.company, user=self.user, role=roles.USER)

        self.owner = self.create_user('Owner', 'owner@test.com')
        UserCompanyThrough.objects.create(company=self.company, user=self.owner, role=roles.OWNER)

    def test_not_authenticated(self):
        response = self.get(self.TestView)
        self.assertEquals(response.status_code, 200, msg=response.content)

        response = self.post(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 401, msg=response.content)

        response = self.put(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 401, msg=response.content)

        response = self.delete(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 401, msg=response.content)

    def test_reporter(self):
        self.force_login(self.reporter)

        response = self.get(self.TestView)
        self.assertEquals(response.status_code, 200, msg=response.content)

        response = self.post(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 200, msg=response.content)

        response = self.put(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 403, msg=response.content)

        response = self.delete(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 403, msg=response.content)

    def test_user(self):
        self.force_login(self.user)

        response = self.get(self.TestView)
        self.assertEquals(response.status_code, 200, msg=response.content)

        response = self.post(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 200, msg=response.content)

        response = self.put(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 200, msg=response.content)

        response = self.delete(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 403, msg=response.content)

    def test_owner(self):
        self.force_login(self.owner)

        response = self.get(self.TestView)
        self.assertEquals(response.status_code, 200, msg=response.content)

        response = self.post(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 200, msg=response.content)

        response = self.put(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 200, msg=response.content)

        response = self.delete(self.TestView, {'company_id': self.company.id})
        self.assertEquals(response.status_code, 200, msg=response.content)

        response = self.delete(self.TestView, url=f'?company_id={self.company.id}')
        self.assertEquals(response.status_code, 200, msg=response.content)
