from base.tests import JWTTestCase, UserTestMixin
from custom_auth import roles
from custom_auth.models import UserCompanyThrough

from . import views
from .models import Company


class CompanyTestMixin(UserTestMixin):
    setup_create_company = False
    setup_set_role = False

    company = None
    company_name = 'Kodeworks AS'
    org_nr = '472487782428'
    company_id_field = 'company_id'
    role = roles.REPORTER

    def setUp(self):
        super().setUp()

        self.setup_create_company = self.setup_create_company or self.setup_set_role

        if self.setup_create_company:
            self.company = self.create_company()

        if self.setup_set_role:
            if not self.user:
                self.user = self.create_user()
            self.set_role()

    def perform_request(self, method, view, data={}, url='', **kwargs):
        if self.company_id_field not in data and self.company is not None:
            data[self.company_id_field] = self.company.pk

        return super().perform_request(method, view, data, url, **kwargs)

    def create_company(self, name=None, org_nr=None):
        return Company.objects.create(name=name or self.company_name, org_nr=org_nr or self.org_nr)

    def set_role(self, company=None, user=None, role=None):
        UserCompanyThrough.objects.update_or_create(company=company or self.company,
                                                    user=user or self.user,
                                                    defaults={'role': role or self.role})


class CompanyViewReporterTestCase(CompanyTestMixin, JWTTestCase):
    setup_create_user = True

    def test_create_company(self):
        response = self.post(views.CompanyView, {'name': self.company_name, 'org_nr': self.org_nr})
        self.assertEquals(response.status_code, 401, msg=response.content)

        self.force_login(self.user)
        response = self.post(views.CompanyView, {'name': self.company_name, 'org_nr': self.org_nr})
        self.assertEquals(response.status_code, 201, msg=response.content)
        self.assertEquals(response.data['name'], self.company_name, msg=response.content)
        self.assertTrue(Company.objects.filter(name=self.company_name).exists(), msg=response.content)

    def test_get_company(self):
        company = self.create_company()

        response = self.get(views.CompanyView, {'company_id': company.pk})
        self.assertEquals(response.status_code, 401, msg=response.content)

        self.force_login(self.user)
        self.set_role(company, self.user, roles.REPORTER)

        response = self.get(views.CompanyView, {'company_id': company.pk})
        expected = {
            'id': company.id,
            'name': company.name,
            'org_nr': company.org_nr,
            'users': [
                {'user_id': self.user.id, 'company_id': company.id, 'role': roles.REPORTER},
            ],
        }
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data, expected, msg=response.content)


class CompanyViewOwnerTestCase(CompanyTestMixin, JWTTestCase):
    setup_create_company = True
    setup_login = True
    setup_set_role = True

    role = roles.OWNER

    def test_update_company(self):
        new_name = 'New Inc.'
        response = self.put(views.CompanyView, {'company_id': self.company.pk, 'name': new_name,
                                                'org_nr': self.org_nr})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['name'], new_name, msg=response.content)
        self.assertEquals(Company.objects.get(org_nr=self.org_nr).name, new_name, msg=response.content)

    def test_delete_company(self):
        response = self.delete(views.CompanyView, {'company_id': self.company.pk})
        self.assertEquals(response.status_code, 204, msg=response.content)
        self.assertFalse(Company.objects.filter(pk=self.company.pk).exists(), msg=response.content)

    def test_add_user(self):
        user2 = self.create_user('user2@test.com', 'password2')
        user3 = self.create_user('user3@test.com', 'password3')
        user4 = self.create_user('user4@test.com', 'password4')

        response = self.post(views.CompanyUserView, {'company_id': self.company.pk, 'user_id': user2.pk})
        self.assertEquals(response.status_code, 201, msg=response.content)
        self.assertTrue(user2.has_role(self.company, roles.USER), msg=response.content)

        response = self.post(views.CompanyUserView,
                             {'company_id': self.company.pk, 'user_id': user3.pk, 'role': roles.REPORTER})
        self.assertEquals(response.status_code, 201, msg=response.content)
        self.assertTrue(user3.has_role(self.company, roles.REPORTER), msg=response.content)

        response = self.post(views.CompanyUserView,
                             {'company_id': self.company.pk, 'user_id': user4.pk})
        self.assertEquals(response.status_code, 201, msg=response.content)
        self.assertTrue(user4.has_role(self.company, roles.USER), msg=response.content)

    def test_remove_user(self):
        user2 = self.create_user('user2@test.com', 'password2')

        response = self.delete(views.CompanyUserView, {'company_id': self.company.pk})
        self.assertEquals(response.status_code, 400, msg=response.content)

        response = self.delete(views.CompanyUserView, {'company_id': self.company.pk, 'user_id': 100})
        self.assertEquals(response.status_code, 404, msg=response.content)

        self.set_role(self.company, user2, roles.REPORTER)

        response = self.delete(views.CompanyUserView, {'company_id': self.company.pk, 'user_id': user2.pk})
        self.assertEquals(response.status_code, 204, msg=response.content)
        self.assertFalse(user2.has_role(self.company, roles.REPORTER), msg=response.content)

    def test_set_role(self):
        user2 = self.create_user('user2@test.com', 'password2')

        data = {'company_id': self.company.pk, 'user_id': user2.pk, 'role': roles.USER}
        response = self.put(views.CompanyUserView, data)
        self.assertEquals(response.status_code, 404, msg=response.content)

        self.set_role(self.company, user2, roles.REPORTER)

        response = self.put(views.CompanyUserView, data)
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertTrue(user2.has_role(self.company, roles.USER), msg=response.content)
