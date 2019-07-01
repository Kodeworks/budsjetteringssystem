import datetime
from django.test import TestCase
from django.core.exceptions import ValidationError

from custom_auth import roles
from custom_auth.tests import JWTTestCase
from company.models import Company
from company.tests import CompanyTestMixin
from . import views
from .models import BankBalance
from .serializers import BankBalanceSerializer


class BankBalanceTestCase(TestCase):
    def setUp(self):
        self.company_name = 'Kodeworks AS'
        self.org_nr = '472487782428'

    def create_company(self, name=None, org_nr=None):
        return Company.objects.create(name=name or self.company_name, org_nr=org_nr or self.org_nr)

    def test_unique_date(self):
        company = self.create_company()
        date = datetime.date(2018, 1, 1)
        BankBalance.objects.create(date=date, company=company, money=10000)

        balance = BankBalance(date=date, company=company, money=20000)
        with self.assertRaises(ValidationError):
            balance.full_clean()

        balance.date = datetime.date(2018, 1, 2)
        balance.full_clean()
        balance.save()

        # Test that it doesn't interfere with itself
        balance.full_clean()

        # Change the date after creation
        balance.date = date
        with self.assertRaises(ValidationError):
            balance.full_clean()

    def test_unique_date_different_companies(self):
        company1 = self.create_company()
        company2 = self.create_company(name='Test company', org_nr='442342342')
        date = datetime.date(2018, 1, 1)
        BankBalance.objects.create(date=date, company=company1, money=10000)

        balance = BankBalance(date=date, company=company2, money=20000)
        balance.full_clean()
        balance.save()

    def test_serializer_unique_date(self):
        company = self.create_company()
        date = datetime.date(2018, 1, 1)
        BankBalance.objects.create(date=date, company=company, money=10000)

        serializer = BankBalanceSerializer(data={'date': date, 'money': 10000, 'company_id': company.pk})
        self.assertFalse(serializer.is_valid())

        date = datetime.date(2018, 1, 2)
        serializer = BankBalanceSerializer(data={'date': date, 'money': 10000, 'company_id': company.pk})
        self.assertTrue(serializer.is_valid(), msg=serializer.errors)
        serializer.save()

        # Test that it doesn't interfere with itself
        self.assertTrue(serializer.is_valid(), msg=serializer.errors)

        # Change the date after creation
        balance = BankBalance.objects.get(date=date)
        date = datetime.date(2018, 1, 1)
        serializer = BankBalanceSerializer(balance, data={'date': date})
        self.assertFalse(serializer.is_valid())

    def test_serializer_unique_date_different_companies(self):
        company1 = self.create_company()
        company2 = self.create_company(name='Test company', org_nr='442342342')
        date = datetime.date(2018, 1, 1)
        BankBalance.objects.create(date=date, company=company1, money=10000)

        serializer = BankBalanceSerializer(data={'date': date, 'money': 10000, 'company_id': company2.pk})
        self.assertTrue(serializer.is_valid(), msg=serializer.errors)
        serializer.save()


class BankBalanceViewTestCase(CompanyTestMixin, JWTTestCase):
    def setUp(self):
        super().setUp()
        self.company = self.create_company()
        self.set_role(self.company, self.user, role=roles.USER)
        self.force_login(self.user)

    def test_create_bank_balance(self):
        date = datetime.date(2018, 1, 1)
        response = self.post(views.BankBalanceView, {'date': date, 'money': 1000})
        self.assertEquals(response.status_code, 201, msg=response.content)
        self.assertEquals(response.data['date'], str(date), msg=response.content)
        self.assertTrue(BankBalance.objects.filter(pk=response.data['id']).exists(), msg=response.content)

    def test_get_bank_balance(self):
        date = datetime.date(2018, 1, 1)
        balance = BankBalance.objects.create(date=date, company=self.company, money=20000)

        response = self.get(views.BankBalanceView, {'id': balance.id})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['date'], str(date), msg=response.content)
        self.assertEquals(response.data['id'], balance.pk, msg=response.content)
        self.assertEquals(response.data['money'], balance.money, msg=response.content)
        self.assertEquals(response.data['company_id'], balance.company.pk, msg=response.content)

    def test_get_bank_balance_by_date(self):
        date = datetime.date(2018, 1, 1)
        balance = BankBalance.objects.create(date=date, company=self.company, money=20000)

        response = self.get(views.BankBalanceByDateView, {'date': date})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['id'], balance.pk, msg=response.content)

    def test_update_bank_balance(self):
        date = datetime.date(2018, 1, 1)
        balance = BankBalance.objects.create(date=date, company=self.company, money=20000)

        response = self.put(views.BankBalanceView, {'id': balance.pk, 'money': 1000, 'date': date})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['date'], str(date), msg=response.content)
        self.assertEquals(response.data['money'], 1000, msg=response.content)
        self.assertEquals(BankBalance.objects.get(pk=balance.pk).money, 1000)

    def test_delete_bank_balance(self):
        date = datetime.date(2018, 1, 1)
        balance = BankBalance.objects.create(date=date, company=self.company, money=20000)

        response = self.delete(views.BankBalanceView, {'id': balance.pk})
        self.assertEquals(response.status_code, 204, msg=response.content)
        self.assertFalse(BankBalance.objects.filter(pk=balance.pk).exists(), msg=response.content)

    def test_get_bank_balance_by_date_range(self):
        date1 = datetime.date(2018, 1, 1)
        date2 = datetime.date(2018, 2, 1)
        date3 = datetime.date(2018, 3, 1)
        BankBalance.objects.create(date=date1, company=self.company, money=20000)
        BankBalance.objects.create(date=date2, company=self.company, money=10000)
        BankBalance.objects.create(date=date3, company=self.company, money=50000)

        response = self.get(views.BankBalanceByDateRangeView, {'start_date': str(date1), 'end_date': str(date3)})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['count'], 3, msg=response.content)

        response = self.get(views.BankBalanceByDateRangeView, {'start_date': date2, 'end_date': date3})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['count'], 2, msg=response.content)

        response = self.get(views.BankBalanceByDateRangeView, {'start_date': date2, 'end_date': date2})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['count'], 1, msg=response.content)

        response = self.get(views.BankBalanceByDateRangeView, {'start_date': date2})
        self.assertEquals(response.status_code, 400, msg=response.content)

        response = self.get(views.BankBalanceByDateRangeView)
        self.assertEquals(response.status_code, 400, msg=response.content)

    def test_balance_different_company(self):
        date = datetime.date(2018, 1, 1)
        company2 = self.create_company('Fake corp', '754782842')
        response = self.post(views.BankBalanceView, {'date': date, 'money': 1000, 'company_id': company2.pk})
        self.assertEquals(response.status_code, 403, msg=response.content)
