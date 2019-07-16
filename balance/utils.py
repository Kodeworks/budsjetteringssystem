import datetime
from dateutil.relativedelta import relativedelta
from typing import Any
from dataclasses import dataclass
from django.db.models import Q

from transaction.models import Transaction, RecurringTransaction
from transaction.utils import RecurringTransactionOccurence
from .models import BankBalance


day = datetime.timedelta(days=1)


@dataclass
class Balance:
    """Estimates the balance of an account from the transactions in the account."""
    company_id: int
    date: datetime.date
    money: int

    @classmethod
    def from_bank_balance(cls, bank_balance):
        return cls(company_id=bank_balance.company.pk, date=bank_balance.date, money=bank_balance.money)

    @classmethod
    def get_transaction_balances(cls, company_id, start_date, end_date, start_balance=0):
        """Helper method that accumulates balances from transactions."""
        balances = {}
        balance = start_balance
        transaction_queryset = Transaction.objects.filter(company=company_id, date__gte=start_date, date__lte=end_date)
        recurring_transactions = RecurringTransaction.get_all_occurences(company_id, start_date, end_date, False)

        transactions = {}
        for transaction in transaction_queryset:
            money = transaction.money
            if transaction.type != Transaction.INCOME:
                money = -money

            if transaction.date in transactions:
                transactions[transaction.date] += money
            else:
                transactions[transaction.date] = money

        for recurring, dates in recurring_transactions:
            money = recurring.template.money
            if recurring.template.type != Transaction.INCOME:
                money = -money

            for date in dates:
                if date in transactions:
                    transactions[date] += money
                else:
                    transactions[date] = money

        # We loop through the dictionary, sorted by date
        for date, money in sorted(transactions.items(), key=lambda x: x[0]):
            balance += money
            balances[date] = cls(company_id=company_id, date=date, money=balance)

        return balances

    @classmethod
    def for_date_range(cls, company_id, start_date, end_date, include_bank_balances=False):
        """Get all balances in a date range."""
        balances = {}
        balance = cls.for_date(company_id, start_date - day, True).money
        bank_balances = BankBalance.objects.filter(company=company_id, date__gte=start_date, date__lte=end_date)

        if bank_balances and bank_balances[0].date != start_date:
            period_end = bank_balances[0].date
            if include_bank_balances:
                period_end -= day

            balances.update(cls.get_transaction_balances(company_id, start_date, period_end, balance))
        elif not include_bank_balances:
            balances.update(cls.get_transaction_balances(company_id, start_date, start_date, balance))

        for i, bank_balance in enumerate(bank_balances):
            if include_bank_balances:
                balances[bank_balance.date] = cls.from_bank_balance(bank_balance)

            balance = bank_balance.money

            period_start = bank_balance.date + day

            if len(bank_balances) > i + 1:
                period_end = bank_balances[i + 1].date
                if not include_bank_balances:
                    period_end -= day
            else:
                period_end = end_date

            balances.update(cls.get_transaction_balances(company_id, period_start, period_end, balance))

        return list(balances.values())

    @classmethod
    def for_date(cls, company_id, date, include_bank_balances=False):
        """Get the balance for a date."""
        transactions = Transaction.objects.filter(company=company_id, date__lte=date)

        try:
            date_filter = Q(date__lte=date) if include_bank_balances else Q(date__lt=date)
            last_bank_balance = BankBalance.objects.filter(date_filter, company=company_id).latest('date')

            balance = last_bank_balance.money
            if last_bank_balance.date == date:
                return cls.from_bank_balance(last_bank_balance)
            else:
                transactions = transactions.filter(date__gt=last_bank_balance.date)
                recurring_transactions = RecurringTransaction.get_all_occurences(company_id,
                                                                                 last_bank_balance.date + day,
                                                                                 date, False)
        except BankBalance.DoesNotExist:
            balance = 0
            recurring_transactions = RecurringTransaction.get_all_occurences(company_id,
                                                                             datetime.date.min,
                                                                             date,
                                                                             False)

        for transaction in transactions:
            if transaction.type == Transaction.INCOME:
                balance += transaction.money
            else:
                balance -= transaction.money

        for recurring, dates in recurring_transactions:
            for _ in dates:
                if recurring.template.type == Transaction.INCOME:
                    balance += recurring.template.money
                else:
                    balance -= recurring.template.money

        return cls(company_id=company_id, date=date, money=balance)


@dataclass
class Month:
    """A collection of useful financial information for a month."""
    year: int
    month: int
    start_balance: int
    lowest_balance: int
    transactions: Any
    recurring: Any
    balances: Any
    bank_balances: Any

    @classmethod
    def get(cls, company_id, year, month):
        """Get a Month given a year and month."""
        month_start = datetime.date(year, month, 1)
        month_end = month_start + relativedelta(day=31)
        filter = Q(company=company_id, date__gte=month_start, date__lte=month_end)

        start_balance = Balance.for_date(company_id, month_start - relativedelta(days=1)).money
        balances = Balance.for_date_range(company_id, month_start, month_end)
        transactions = Transaction.objects.filter(filter)
        bank_balances = BankBalance.objects.filter(filter)
        recurring = [RecurringTransactionOccurence(recurring, dates)
                     for recurring, dates in RecurringTransaction.get_all_occurences(company_id,
                                                                                     month_start,
                                                                                     month_end)]

        lowest_balance = min([balance.money for balance in balances + list(bank_balances)], default=start_balance)

        return cls(year, month, start_balance, lowest_balance, transactions, recurring, balances, bank_balances)
