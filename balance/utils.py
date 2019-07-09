import datetime
from django.db.models import Q

from transaction.models import Transaction
from transaction.utils import get_all_recurring_occurences_in_date_range
from .models import BankBalance


day = datetime.timedelta(days=1)


def get_transaction_balances_for_date_range(company, start_date, end_date, start_balance=0):
    balances = {}
    balance = start_balance
    transaction_queryset = Transaction.objects.filter(company=company, date__gte=start_date, date__lte=end_date)
    recurring_transactions = get_all_recurring_occurences_in_date_range(company, start_date, end_date, False)

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

    for date, money in transactions.items():
        balance += money
        balances[date] = balance

    return balances


def get_balances_for_date_range(company, start_date, end_date, include_bank_balances=False):
    balances = {}
    balance = get_balance_for_date(company, start_date - day, True)
    bank_balances = BankBalance.objects.filter(company=company, date__gte=start_date, date__lte=end_date)

    if bank_balances[0].date != start_date:
        period_end = bank_balances[0].date
        if include_bank_balances:
            period_end -= day

        balances.update(get_transaction_balances_for_date_range(company, start_date, period_end, balance))
    elif not include_bank_balances:
        balances.update(get_transaction_balances_for_date_range(company, start_date, start_date, balance))

    for i, bank_balance in enumerate(bank_balances):
        if include_bank_balances:
            balances[bank_balance.date] = bank_balance.money

        balance = bank_balance.money

        period_start = bank_balance.date + day

        if len(bank_balances) > i + 1:
            period_end = bank_balances[i + 1].date
            if not include_bank_balances:
                period_end -= day
        else:
            period_end = end_date

        balances.update(get_transaction_balances_for_date_range(company, period_start, period_end, balance))

    return balances


def get_balance_for_date(company, date, include_bank_balances=False):
    transactions = Transaction.objects.filter(company=company, date__lte=date)

    try:
        date_filter = Q(date__lte=date) if include_bank_balances else Q(date__lt=date)
        last_bank_balance = BankBalance.objects.filter(date_filter, company=company).latest('date')

        balance = last_bank_balance.money
        if last_bank_balance.date == date:
            return balance
        else:
            transactions = transactions.filter(date__gt=last_bank_balance.date)
            recurring_transactions = get_all_recurring_occurences_in_date_range(company, last_bank_balance.date + day,
                                                                                date, False)
    except BankBalance.DoesNotExist:
        balance = 0
        recurring_transactions = get_all_recurring_occurences_in_date_range(company, datetime.date.min, date, False)

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

    return balance
