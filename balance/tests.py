import datetime
from django.test import TestCase
from django.core.exceptions import ValidationError

from company.models import Company
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

        serializer = BankBalanceSerializer(data={'date': date, 'company': company, 'money': 10000})
        self.assertFalse(serializer.is_valid())

        date = datetime.date(2018, 1, 2)
        serializer = BankBalanceSerializer(data={'date': date, 'company': company.pk, 'money': 10000})
        self.assertTrue(serializer.is_valid(), msg=serializer.errors)
        serializer.save()

    def test_serializer_unique_date_different_companies(self):
        company1 = self.create_company()
        company2 = self.create_company(name='Test company', org_nr='442342342')
        date = datetime.date(2018, 1, 1)
        BankBalance.objects.create(date=date, company=company1, money=10000)

        serializer = BankBalanceSerializer(data={'date': date, 'company': company2.pk, 'money': 10000})
        self.assertTrue(serializer.is_valid(), msg=serializer.errors)
        serializer.save()
