import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Q

from base.views import RetrieveCreateUpdateDestroyView, ByDateRangeView, RetrieveView
from base.mixins import CompanyFilterMixin
from base.serializers import DateSerializer, DateRangeSerializer
from transaction.models import Transaction
from transaction.serializers import RecurringTransactionOccurence
from transaction.utils import get_all_recurring_occurences_in_date_range
from .models import BankBalance
from .serializers import BankBalanceSerializer, BalanceSerializer, Balance, MonthSerializer, Month
from .utils import get_balance_for_date, get_balances_for_date_range


class BankBalanceMixin(CompanyFilterMixin):
    lookup_field = 'id'
    queryset = BankBalance.objects.all()
    serializer_class = BankBalanceSerializer


class BankBalanceView(BankBalanceMixin, RetrieveCreateUpdateDestroyView):
    pass


class BankBalanceByDateView(BankBalanceMixin, RetrieveView):
    lookup_field = 'date'


class BankBalanceByDateRangeView(BankBalanceMixin, ByDateRangeView):
    pass


class BalanceView(RetrieveView):
    serializer_class = BalanceSerializer

    def get_object(self):
        arg_serializer = DateSerializer(data=self.get_data())
        arg_serializer.is_valid(raise_exception=True)

        date = arg_serializer.validated_data['date']
        company_id = self.get_company_id()
        balance = get_balance_for_date(company_id, date)
        return Balance(company_id, date, balance)


class BalanceByDateRangeView(RetrieveView):
    serializer_class = BalanceSerializer

    def get_object(self):
        arg_serializer = DateRangeSerializer(data=self.get_data())
        arg_serializer.is_valid(raise_exception=True)

        start_date = arg_serializer.validated_data['start_date']
        end_date = arg_serializer.validated_data['end_date']
        company_id = self.get_company_id()
        balances = get_balances_for_date_range(company_id, start_date, end_date)
        return [Balance(company_id, date, balance) for date, balance in balances.items()]

    def get_serializer(self, *args, **kwargs):
        return super().get_serializer(*args, many=True, **kwargs)


class MonthView(RetrieveView):
    serializer_class = MonthSerializer

    def get_object(self):
        company_id = self.get_company_id()
        data = self.get_data()
        year = int(data['year'])
        month = int(data['month'])
        month_start = datetime.date(year, month, 1)
        month_end = month_start + relativedelta(day=31)
        filter = Q(company=company_id, date__gte=month_start, date__lte=month_end)

        start_balance = get_balance_for_date(company_id, month_start - relativedelta(days=1))
        balances = [Balance(company_id, date, balance) for date, balance in get_balances_for_date_range(company_id, month_start, month_end).items()]
        balances.sort(key=lambda x: x.date)
        transactions = Transaction.objects.filter(filter)
        corrections = BankBalance.objects.filter(filter)
        recurring = [RecurringTransactionOccurence(recurring, dates) for recurring, dates in get_all_recurring_occurences_in_date_range(company_id, month_start, month_end)]

        lowest_balance = min([balance.money for balance in balances + list(corrections)], default=start_balance)

        return Month(year, month, start_balance, lowest_balance, transactions, recurring, balances, corrections)
