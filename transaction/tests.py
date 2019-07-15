from datetime import date, datetime, timedelta
from django.core.exceptions import ValidationError

from base.tests import JWTTestCase
from custom_auth import roles
from company.models import Company
from company.tests import CompanyTestMixin
from .models import Transaction
from . import views
from .models import TransactionStaticData


class TransactionTestMixin(CompanyTestMixin):
    def setUp(self):
        super().setUp()
        self.force_login(self.user)
        self.company = self.create_company()
        self.set_role(self.company, self.user, roles.REPORTER)
        self.date = date(2017, 5, 17)
        self.type = 'IN'
        self.money = '3000'
        self.description = '11th income.'
        self.notes = 'Incomes are cool.'
        self.recurring_transaction = None

    def create_transaction(self, date=None, company=None, recurring_transaction=None, money=None,
                           type=None, description=None, notes=None, save=True):
        transaction = Transaction(date=(date or self.date), company=(company or self.company),
                                  recurring_transaction=(recurring_transaction or self.recurring_transaction),
                                  money=(money or self.money), type=(type or self.type),
                                  description=(description or self.description), notes=(notes or self.notes))
        if save:
            transaction.save()
        return transaction

class TransactionAllTestCase(TransactionTestMixin, JWTTestCase):
    def setUp(self):
        super().setUp()

    def test_no_login(self):
        self.logout()
        response = self.get(views.TransactionAllView, {'limit': 3, 'offset': 0})
        self.assertEquals(response.status_code, 401, msg=response.content)

    def test_no_transactions(self):
        self.force_login(self.user)

        response = self.get(views.TransactionAllView, {'limit': 3, 'offset': 0})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertIsNone(response.data['next'], msg=response.content)
        self.assertIsNone(response.data['previous'], msg=response.content)
        self.assertEquals(response.data['results'], [], msg=response.content)

    def test_transaction_from_correct_company(self):
        self.force_login(self.user)

        test_date = date(2018, 6, 18)
        tr_my_company = self.create_transaction(date=test_date)
        other_company = self.create_company('Other company Inc', '12345')
        tr_other_company = self.create_transaction(company=other_company, date=test_date)

        response = self.get(views.TransactionAllView, {'limit': 3, 'offset': 0})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(len(response.data['results']), 1, msg=response.content)
        transaction_ids = [x['id'] for x in response.data['results']]
        self.assertIn(tr_my_company.id, transaction_ids, msg=response.content)
        self.assertNotIn(tr_other_company.id, transaction_ids, msg=response.content)

    def test_one_page_transactions_ordered_by_date(self):
        self.force_login(self.user)
        tr1 = self.create_transaction(date=datetime(2022, 2, 22), description='second')
        tr2 = self.create_transaction(description='first')

        response = self.get(views.TransactionAllView, {'limit': 3, 'offset': 0})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertIsNone(response.data['next'], msg=response.content)
        self.assertIsNone(response.data['previous'], msg=response.content)
        self.assertEquals(response.data['results'][0]['description'], tr2.description, msg=response.content)
        self.assertEquals(response.data['results'][1]['description'], tr1.description, msg=response.content)

    def test_three_pages_transactions(self):
        self.force_login(self.user)
        tr_first = self.create_transaction(date=datetime(2016, 4, 16), description='first')
        for i in range(6):
            self.create_transaction()
        tr_last = self.create_transaction(date=datetime(2018, 11, 9), description='last')
        tr_not = self.create_transaction(company=Company.objects.create(name='Other', org_nr='648587782428'))
        response_set = []

        response = self.get(views.TransactionAllView, {'limit': 3, 'offset': 0})
        self.assertEquals(response.status_code, 200, msg=response.content)
        response_set.extend(response.data['results'])
        next_url = response.data['next']
        self.assertIsNotNone(next_url, msg=response.content)
        self.assertIn(f'company_id={self.company.pk}', next_url)
        self.assertIn('limit=3', next_url)
        self.assertIn('offset=3', next_url)
        self.assertIsNone(response.data['previous'], msg=response.content)
        self.assertEquals(response.data['results'][0]['description'], tr_first.description, msg=response.content)

        # Follow link to next page
        response = self.get(views.TransactionAllView, url=response.data['next'])
        self.assertEquals(response.status_code, 200, msg=response.content)
        response_set.extend(response.data['results'])
        next_url = response.data['next']
        prev_url = response.data['previous']
        self.assertIsNotNone(next_url, msg=response.content)
        self.assertIsNotNone(prev_url, msg=response.content)
        self.assertIn(f'company_id={self.company.pk}', next_url)
        self.assertIn('limit=3', next_url)
        self.assertIn('offset=6', next_url)
        self.assertIn(f'company_id={self.company.pk}', prev_url)
        self.assertIn('limit=3', prev_url)
        self.assertEquals(len(response.data['results']), 3, msg=response.content)

        # Check that link back is to first page if 'offset=0' is added
        url_first = response.data['previous'] + '&offset=0'
        response_first = self.get(views.TransactionAllView, url=url_first)
        self.assertEquals(response_first.status_code, 200, msg=response_first.content)
        self.assertEquals(response_first.data['results'][0]['description'],
                          tr_first.description, msg=response_first.content)
        self.assertEquals(len(response_first.data['results']), 3, msg=response_first.content)

        # Check that link back when 'offset='1' is added does not contain first element
        url_back = response.data['previous'] + '&offset=1'
        response_back = self.get(views.TransactionAllView, url=url_back)
        self.assertEquals(response_back.status_code, 200, msg=response_back.content)
        self.assertNotIn(tr_first, response_back.data['results'], msg=response_back.content)
        self.assertEquals(len(response_back.data['results']), 3, msg=response_back.content)

        # Follow link to last page
        response = self.get(views.TransactionAllView, url=response.data['next'])
        self.assertEquals(response.status_code, 200, msg=response.content)
        response_set.extend(response.data['results'])
        self.assertIsNone(response.data['next'], msg=response.content)
        prev_url = response.data['previous']
        self.assertIsNotNone(prev_url, msg=response.content)
        self.assertIn(f'company_id={self.company.pk}', prev_url)
        self.assertIn('limit=3', prev_url)
        self.assertIn('offset=3', prev_url)
        self.assertEquals(len(response.data['results']), 2, msg=response.content)
        self.assertEquals(response.data['results'][1]['description'], tr_last.description, msg=response.content)
        self.assertNotIn(tr_not, response_set, msg=response.content)


class TransactionByDateTestCase(TransactionTestMixin, JWTTestCase):
    def setUp(self):
        super().setUp()
        self.force_login(self.user)

    def test_transaction_by_date(self):
        test_date = date(2019, 4, 23)
        tr1 = self.create_transaction(money=3000, date=test_date)
        tr2 = self.create_transaction(money=4000, date=test_date)
        tr3 = self.create_transaction(money=5000, date=test_date + timedelta(days=2))

        response = self.get(views.TransactionByDateView, {'date': test_date})
        self.assertEquals(response.status_code, 200, msg=response.content)
        self.assertEquals(len(response.data['results']), 2, msg=response.data)

        transactions_ids = [x['id'] for x in response.data['results']]
        self.assertIn(tr1.id, transactions_ids, msg=response.content)
        self.assertIn(tr2.id, transactions_ids, msg=response.content)
        self.assertNotIn(tr3.id, transactions_ids, msg=response.content)

    def test_transaction_from_correct_company(self):
        test_date = date(2018, 6, 18)
        tr_my_company = self.create_transaction(date=test_date)
        other_company = self.create_company('Other company Inc', '12345')
        tr_other_company = self.create_transaction(company=other_company, date=test_date)

        response = self.get(views.TransactionByDateView, {'date': test_date, 'company_id': self.company.pk})
        self.assertEquals(response.status_code, 200, msg=response.content)

        transaction_ids = [x['id'] for x in response.data['results']]
        self.assertIn(tr_my_company.id, transaction_ids, msg=response.content)
        self.assertNotIn(tr_other_company.id, transaction_ids, msg=response.content)

    def test_invalid_date_format(self):
        test_date = '2019,88,102'

        with self.assertRaises(ValidationError):
            self.get(views.TransactionByDateView, {'date': test_date})


class TransactionByDateRangeTestCase(TransactionTestMixin, JWTTestCase):
    def setUp(self):
        super().setUp()
        self.force_login(self.user)

    def test_transactions_by_date_range(self):
        dates = [date(2017, 6, 4), date(2017, 6, 5), date(2017, 6, 5), date(2019, 6, 7),
                 date(2019, 6, 7), date(2019, 7, 2), date(2021, 8, 3), date(2021, 8, 4)]

        other_company = self.create_company(name='Other Inc', org_nr='12345')
        self.create_transaction(date=dates[3], company=other_company)

        transactions = [self.create_transaction(date=date).pk for date in dates]

        response = self.get(views.TransactionByDateRangeView, {'start_date': dates[1], 'end_date': dates[6]})
        self.assertEquals(response.status_code, 200, msg=response.content)
        response_ids = [transaction['id'] for transaction in response.data['results']]
        self.assertEquals(transactions[1:7], response_ids, msg=response.content)

    def test_no_login(self):
        self.logout()
        response = self.get(views.TransactionByDateRangeView, {
            'start_date': date(2017, 6, 4),
            'end_date': date(2017, 6, 5)
        })
        self.assertEquals(response.status_code, 401, msg=response.content)


class TransactionIncomeAllTestCase(TransactionTestMixin, JWTTestCase):
    def setUp(self):
        super().setUp()
        self.force_login(self.user)

    def test_only_income_returned(self):
        trans_in = self.create_transaction(money=3000, type=TransactionStaticData.INCOME)
        trans_ex = self.create_transaction(money=4000, type=TransactionStaticData.EXPENSE)

        response = self.get(views.TransactionIncomeAllView, {'company_id': self.company.pk})
        transaction_ids = [trans['id'] for trans in response.data['results']]
        self.assertIn(trans_in.id, transaction_ids, msg=response.content)
        self.assertNotIn(trans_ex.id, transaction_ids, msg=response.content)


class TransactionExpenseAllTestCase(TransactionTestMixin, JWTTestCase):
    def setUp(self):
        super().setUp()
        self.force_login(self.user)

    def test_only_expenses_returned(self):
        trans_in = self.create_transaction(money=3000, type=TransactionStaticData.INCOME)
        trans_ex = self.create_transaction(money=4000, type=TransactionStaticData.EXPENSE)

        response = self.get(views.TransactionExpenseAllView, {'company_id': self.company.pk})
        transaction_ids = [trans['id'] for trans in response.data['results']]
        self.assertIn(trans_ex.id, transaction_ids, msg=response.content)
        self.assertNotIn(trans_in.id, transaction_ids, msg=response.content)
