from base.tests import JWTTestCase
from custom_auth import roles
from custom_auth.models import UserCompanyThrough

from . import views
from .models import Company


class CompanyTestMixin:
    company = None
    company_id_field = 'company_id'

    def setUp(self):
        super().setUp()
        self.user = self.create_user()
        self.company_name = 'Kodeworks AS'
        self.org_nr = '472487782428'

    def perform_request(self, method, view, data={}, url='', **kwargs):
        if self.company_id_field not in data and self.company is not None:
            data[self.company_id_field] = self.company.pk

        return super().perform_request(method, view, data, url, **kwargs)

    def create_company(self, name=None, org_nr=None):
        return Company.objects.create(name=name or self.company_name, org_nr=org_nr or self.org_nr)

    def set_role(self, company, user, role):
        UserCompanyThrough.objects.update_or_create(company=company, user=user, defaults={'role': role})


class CompanyViewTestCase(CompanyTestMixin, JWTTestCase):
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
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['name'], company.name, msg=response.content)

    def test_update_company(self):
        company = self.create_company()
        self.force_login(self.user)
        self.set_role(company, self.user, roles.OWNER)

        new_name = 'New Inc.'
        response = self.put(views.CompanyView, {'company_id': company.pk, 'name': new_name, 'org_nr': self.org_nr})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['name'], new_name, msg=response.content)
        self.assertEquals(Company.objects.get(org_nr=self.org_nr).name, new_name, msg=response.content)

    def test_delete_company(self):
        company = self.create_company()
        self.force_login(self.user)
        self.set_role(company, self.user, roles.OWNER)

        response = self.delete(views.CompanyView, {'company_id': company.pk})
        self.assertEquals(response.status_code, 204, msg=response.content)
        self.assertFalse(Company.objects.filter(pk=company.pk).exists(), msg=response.content)

    def test_add_user(self):
        company = self.create_company()
        self.force_login(self.user)
        self.set_role(company, self.user, roles.OWNER)
        user2 = self.create_user('user2@test.com', 'password2')
        user3 = self.create_user('user3@test.com', 'password3')
        user4 = self.create_user('user4@test.com', 'password4')

        response = self.post(views.CompanyAddUserView, {'company_id': company.pk, 'user_id': user2.pk})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertTrue(user2.has_role(company, roles.USER), msg=response.content)

        response = self.post(views.CompanyAddUserView,
                             {'company_id': company.pk, 'user_id': user3.pk, 'role': roles.REPORTER})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertTrue(user3.has_role(company, roles.REPORTER), msg=response.content)

        response = self.post(views.CompanyAddUserView,
                             {'company_id': company.pk, 'user_id': user4.pk, 'role': None})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertTrue(user4.has_role(company, roles.USER), msg=response.content)

    def test_remove_user(self):
        company = self.create_company()
        self.force_login(self.user)
        self.set_role(company, self.user, roles.OWNER)
        user2 = self.create_user('user2@test.com', 'password2')

        response = self.post(views.CompanyRemoveUserView, {'company_id': company.pk, 'user_id': user2.pk})
        self.assertEquals(response.status_code, 404, msg=response.content)

        self.set_role(company, user2, roles.REPORTER)

        response = self.post(views.CompanyRemoveUserView, {'company_id': company.pk, 'user_id': user2.pk})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertFalse(user2.has_role(company, roles.REPORTER), msg=response.content)

    def test_set_role(self):
        company = self.create_company()
        self.force_login(self.user)
        self.set_role(company, self.user, roles.OWNER)
        user2 = self.create_user('user2@test.com', 'password2')

        data = {'company_id': company.pk, 'user_id': user2.pk, 'role': roles.USER}
        response = self.post(views.CompanySetRoleView, data)
        self.assertEquals(response.status_code, 404, msg=response.content)

        self.set_role(company, user2, roles.REPORTER)

        response = self.post(views.CompanySetRoleView, data)
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertTrue(user2.has_role(company, roles.USER), msg=response.content)
