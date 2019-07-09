from base.views import RetrieveCreateUpdateDestroyView, ByDateRangeView, RetrieveView
from base.mixins import CompanyFilterMixin
from base.serializers import DateSerializer, DateRangeSerializer
from .models import BankBalance
from .serializers import BankBalanceSerializer, BalanceSerializer, Balance
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
