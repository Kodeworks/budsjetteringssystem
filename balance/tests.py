import datetime
from django.core.exceptions import ValidationError

from custom_auth import roles
from custom_auth.tests import JWTTestCase
from company.tests import CompanyTestMixin
from transaction.models import Transaction
from transaction.tests import RecurringTransactionTestMixin
from transaction.utils import RecurringTransactionOccurence
from . import views
from .models import BankBalance
from .serializers import BankBalanceSerializer, MonthSerializer
from .utils import Balance, Month


class BankBalanceTestMixin(CompanyTestMixin):
    def setUp(self):
        super().setUp()
        self.company = self.create_company()

    def create_bank_balance(self, date, money, company=None):
        return BankBalance.objects.create(company=company or self.company, money=money, date=date)


class BankBalanceTestCase(BankBalanceTestMixin, JWTTestCase):
    def test_unique_date(self):
        date = datetime.date(2018, 1, 1)
        self.create_bank_balance(date, 10000)

        balance = BankBalance(date=date, company=self.company, money=20000)
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
        company1 = self.company
        company2 = self.create_company(name='Test company', org_nr='442342342')
        date = datetime.date(2018, 1, 1)
        self.create_bank_balance(date, 10000, company1)

        balance = BankBalance(date=date, company=company2, money=20000)
        balance.full_clean()
        balance.save()

    def test_serializer_unique_date(self):
        date = datetime.date(2018, 1, 1)
        self.create_bank_balance(date, 10000)

        serializer = BankBalanceSerializer(data={'date': date, 'money': 10000, 'company_id': self.company.pk})
        self.assertFalse(serializer.is_valid())

        date = datetime.date(2018, 1, 2)
        serializer = BankBalanceSerializer(data={'date': date, 'money': 10000, 'company_id': self.company.pk})
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
        company2 = self.create_company(name='Test company', org_nr='442342342')
        date = datetime.date(2018, 1, 1)
        self.create_bank_balance(date, 10000)

        serializer = BankBalanceSerializer(data={'date': date, 'money': 10000, 'company_id': company2.pk})
        self.assertTrue(serializer.is_valid(), msg=serializer.errors)
        serializer.save()


class BankBalanceViewTestCase(BankBalanceTestMixin, JWTTestCase):
    def setUp(self):
        super().setUp()
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
        balance = self.create_bank_balance(date, 20000)

        response = self.get(views.BankBalanceView, {'id': balance.id})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['date'], str(date), msg=response.content)
        self.assertEquals(response.data['id'], balance.pk, msg=response.content)
        self.assertEquals(response.data['money'], balance.money, msg=response.content)
        self.assertEquals(response.data['company_id'], balance.company.pk, msg=response.content)

    def test_get_bank_balance_by_date(self):
        date = datetime.date(2018, 1, 1)
        balance = self.create_bank_balance(date, 20000)

        response = self.get(views.BankBalanceByDateView, {'date': date})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['id'], balance.pk, msg=response.content)

    def test_update_bank_balance(self):
        date = datetime.date(2018, 1, 1)
        balance = self.create_bank_balance(date, 20000)

        response = self.put(views.BankBalanceView, {'id': balance.pk, 'money': 1000, 'date': date})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data['date'], str(date), msg=response.content)
        self.assertEquals(response.data['money'], 1000, msg=response.content)
        self.assertEquals(BankBalance.objects.get(pk=balance.pk).money, 1000)

    def test_delete_bank_balance(self):
        date = datetime.date(2018, 1, 1)
        balance = self.create_bank_balance(date, 20000)

        response = self.delete(views.BankBalanceView, {'id': balance.pk})
        self.assertEquals(response.status_code, 204, msg=response.content)
        self.assertFalse(BankBalance.objects.filter(pk=balance.pk).exists(), msg=response.content)

    def test_get_bank_balance_by_date_range(self):
        date1 = datetime.date(2018, 1, 1)
        date2 = datetime.date(2018, 2, 1)
        date3 = datetime.date(2018, 3, 1)
        self.create_bank_balance(date1, 20000)
        self.create_bank_balance(date2, 10000)
        self.create_bank_balance(date3, 50000)

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


class BalanceCalculationTestCase(BankBalanceTestMixin, RecurringTransactionTestMixin, JWTTestCase):
    def setUp(self):
        super(RecurringTransactionTestMixin, self).setUp()
        self.type = Transaction.INCOME
        self.recurring_transaction = None
        self.description = 'Test'
        self.notes = ''

        self.create_bank_balance(datetime.date(2019, 7, 1), 1000)
        self.create_transaction(date=datetime.date(2019, 7, 1), money=2000, type=Transaction.EXPENSE)
        self.create_transaction(date=datetime.date(2019, 7, 2), money=-1000)
        self.create_transaction(date=datetime.date(2019, 7, 3), money=5000)
        self.create_transaction(date=datetime.date(2019, 7, 3), money=1000, type=Transaction.EXPENSE)
        self.create_bank_balance(datetime.date(2019, 7, 8), 8000)
        self.create_bank_balance(datetime.date(2019, 7, 12), 5000)

        self.create_recurring(start_date=datetime.date(2019, 7, 8), end_date=datetime.date(2019, 7, 20),
                              day_delta=2, money=1000)
        self.create_recurring(start_date=datetime.date(2019, 7, 10), end_date=datetime.date(2019, 8, 12),
                              month_delta=1, money=2000)

        self.day1 = Balance(self.company.pk, datetime.date(2019, 7, 1), money=-2000)
        self.day1_bb = Balance(self.company.pk, datetime.date(2019, 7, 1), money=1000)
        self.day2 = Balance(self.company.pk, datetime.date(2019, 7, 2), money=0)
        self.day3 = Balance(self.company.pk, datetime.date(2019, 7, 3), money=4000)
        self.day8 = Balance(self.company.pk, datetime.date(2019, 7, 8), money=5000)
        self.day8_bb = Balance(self.company.pk, datetime.date(2019, 7, 8), money=8000)
        self.day10 = Balance(self.company.pk, datetime.date(2019, 7, 10), money=11000)
        self.day12 = Balance(self.company.pk, datetime.date(2019, 7, 12), money=12000)
        self.day12_bb = Balance(self.company.pk, datetime.date(2019, 7, 12), money=5000)
        self.day14 = Balance(self.company.pk, datetime.date(2019, 7, 14), money=6000)
        self.day16 = Balance(self.company.pk, datetime.date(2019, 7, 16), money=7000)
        self.day18 = Balance(self.company.pk, datetime.date(2019, 7, 18), money=8000)
        self.day20 = Balance(self.company.pk, datetime.date(2019, 7, 20), money=9000)
        self.day41 = Balance(self.company.pk, datetime.date(2019, 8, 10), money=11000)

    def test_get_balance_for_date(self):
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 1)), self.day1)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 2)), self.day2)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 3)), self.day3)

        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 1), True), self.day1_bb)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 2), True), self.day2)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 3), True), self.day3)

    def test_get_balance_for_date_with_recurring(self):
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 8)), self.day8)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 10)), self.day10)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 12)), self.day12)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 8, 10)), self.day41)

        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 8), True), self.day8_bb)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 10), True), self.day10)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 12), True), self.day12_bb)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 8, 10), True), self.day41)

    def test_get_balance_for_date_with_leading_recurring(self):
        self.create_recurring(start_date=datetime.date(2019, 6, 20), end_date=datetime.date(2019, 6, 30),
                              day_delta=2, money=1000)

        self.day1.money += 6000
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 1)), self.day1)
        self.assertEqual(Balance.for_date(self.company.pk, datetime.date(2019, 7, 1), True), self.day1_bb)

    def test_get_balance_for_date_range(self):
        self.assertEqual(
            Balance.for_date_range(
                self.company.pk,
                datetime.date(2019, 7, 1),
                datetime.date(2019, 7, 3),
            ),
            [
                self.day1,
                self.day2,
                self.day3,
            ]
        )

        self.assertEqual(
            Balance.for_date_range(
                self.company.pk,
                datetime.date(2019, 7, 1),
                datetime.date(2019, 7, 3),
                True,
            ),
            [
                self.day1_bb,
                self.day2,
                self.day3,
            ]
        )

    def test_get_balance_for_date_range_with_recurring(self):
        self.assertEqual(
            Balance.for_date_range(
                self.company.pk,
                datetime.date(2019, 7, 2),
                datetime.date(2019, 8, 15),
            ),
            [
                self.day2,
                self.day3,
                self.day8,
                self.day10,
                self.day14,
                self.day16,
                self.day18,
                self.day20,
                self.day41,
            ]
        )

        self.assertEqual(
            Balance.for_date_range(
                self.company.pk,
                datetime.date(2019, 7, 2),
                datetime.date(2019, 8, 15),
                True,
            ),
            [
                self.day2,
                self.day3,
                self.day8_bb,
                self.day10,
                self.day12_bb,
                self.day14,
                self.day16,
                self.day18,
                self.day20,
                self.day41,
            ]
        )


class BalanceViewTestCase(BankBalanceTestMixin, RecurringTransactionTestMixin, JWTTestCase):
    def setUp(self):
        super(RecurringTransactionTestMixin, self).setUp()
        self.set_role(self.company, self.user, role=roles.USER)
        self.force_login(self.user)

        self.type = Transaction.INCOME
        self.recurring_transaction = None
        self.description = 'Test'
        self.notes = ''

        self.create_bank_balance(datetime.date(2019, 7, 1), 1000)
        self.create_transaction(date=datetime.date(2019, 7, 1), money=2000, type=Transaction.EXPENSE)
        self.create_transaction(date=datetime.date(2019, 7, 2), money=-1000)
        self.create_transaction(date=datetime.date(2019, 7, 3), money=5000)
        self.create_transaction(date=datetime.date(2019, 7, 3), money=2000, type=Transaction.EXPENSE)
        self.create_bank_balance(datetime.date(2019, 7, 8), 8000)

        self.create_recurring(start_date=datetime.date(2019, 7, 1), end_date=datetime.date(2019, 7, 8),
                              day_delta=2, money=1000)

        self.day1 = -1000
        self.day2 = 0
        self.day3 = 4000
        self.day5 = 5000
        self.day7 = 6000
        self.day8 = 6000

    def test_balance_view(self):
        date = str(datetime.date(2019, 7, 5))
        response = self.get(views.BalanceView, {'date': date})
        expected = {'company_id': self.company.pk, 'date': date, 'money': self.day5}
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data, expected, msg=response.content)

        date = str(datetime.date(2019, 7, 8))
        response = self.get(views.BalanceView, {'date': date})
        expected = {'company_id': self.company.pk, 'date': date, 'money': self.day8}
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(response.data, expected, msg=response.content)

    def test_balance_by_date_range_view(self):
        date1 = str(datetime.date(2019, 7, 1))
        date2 = str(datetime.date(2019, 7, 2))
        date3 = str(datetime.date(2019, 7, 3))
        date5 = str(datetime.date(2019, 7, 5))
        date7 = str(datetime.date(2019, 7, 7))
        date9 = str(datetime.date(2019, 7, 9))

        response = self.get(views.BalanceByDateRangeView, {'start_date': date1, 'end_date': date9})
        expected = [
            {'company_id': self.company.pk, 'date': date1, 'money': self.day1},
            {'company_id': self.company.pk, 'date': date2, 'money': self.day2},
            {'company_id': self.company.pk, 'date': date3, 'money': self.day3},
            {'company_id': self.company.pk, 'date': date5, 'money': self.day5},
            {'company_id': self.company.pk, 'date': date7, 'money': self.day7},
        ]

        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals([dict(elem) for elem in response.data], expected, msg=response.content)


class MonthViewTestCase(BankBalanceTestMixin, RecurringTransactionTestMixin, JWTTestCase):
    def setUp(self):
        super(RecurringTransactionTestMixin, self).setUp()
        self.set_role(self.company, self.user, role=roles.USER)

    def test_month(self):
        bank1 = self.create_bank_balance(datetime.date(2019, 6, 1), 1000)
        bank2 = self.create_bank_balance(datetime.date(2019, 7, 1), 4000)
        transaction1 = self.create_transaction(date=datetime.date(2019, 7, 2), money=-1000)

        recurring1 = self.create_recurring(start_date=datetime.date(2019, 7, 3),
                                           end_date=datetime.date(2019, 7, 7),
                                           day_delta=2,
                                           money=1000)

        transaction2 = self.create_transaction(date=datetime.date(2019, 7, 5),
                                               money=5000,
                                               recurring_transaction=recurring1)

        response = self.get(views.MonthView, {'year': 2019, 'month': 6})

        expected = {
            'year': 2019,
            'month': 6,
            'start_balance': 0,
            'lowest_balance': bank1.money,
            'transactions': [],
            'recurring': [],
            'balances': [],
            'bank_balances': [
                BankBalanceSerializer(bank1).data
            ],
        }
        self.assertEqual(response.data, expected, msg=response.content)

        response = self.get(views.MonthView, {'year': 2019, 'month': 7})
        expected = MonthSerializer(
            Month(
                year=2019,
                month=7,
                start_balance=bank1.money,
                lowest_balance=3000,
                transactions=[
                    transaction1,
                    transaction2,
                ],
                recurring=[
                    RecurringTransactionOccurence(object=recurring1,
                                                  dates=[
                                                      datetime.date(2019, 7, 3),
                                                      datetime.date(2019, 7, 5),
                                                      datetime.date(2019, 7, 7),
                                                  ]),
                ],
                balances=[
                    Balance(self.company.pk, datetime.date(2019, 7, 2), 3000),
                    Balance(self.company.pk, datetime.date(2019, 7, 3), 4000),
                    Balance(self.company.pk, datetime.date(2019, 7, 5), 9000),
                    Balance(self.company.pk, datetime.date(2019, 7, 7), 10000),
                ],
                bank_balances=[
                    bank2,
                ],
            )
        ).data
        self.assertEqual(response.data, expected, msg=response.content)
