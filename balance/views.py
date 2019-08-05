from rest_framework.exceptions import ParseError

from base.views import RetrieveCreateUpdateDestroyView, ByDateRangeView, RetrieveView
from base.mixins import CompanyFilterMixin, ManyMixin, ByDateRangeMixin
from base.serializers import DateSerializer
from .models import BankBalance
from .serializers import BankBalanceSerializer, BalanceSerializer, MonthSerializer, MonthYearSerializer
from .utils import Balance, Month


class BankBalanceMixin(CompanyFilterMixin):
    lookup_field = 'id'
    queryset = BankBalance.objects.all()
    serializer_class = BankBalanceSerializer


class BankBalanceView(BankBalanceMixin, RetrieveCreateUpdateDestroyView):
    """Manage a bank balance for a company."""
    pass


class BankBalanceByDateView(BankBalanceMixin, RetrieveView):
    """Get a bank balance for a company by date."""
    lookup_field = 'date'


class BankBalanceByDateRangeView(BankBalanceMixin, ByDateRangeView):
    """Get a bank balance for a company by date range."""
    pass


class BalanceView(RetrieveView):
    """Get a balance for a company by date."""
    serializer_class = BalanceSerializer
    request_serializer_class = DateSerializer

    def get_object(self):
        arg_serializer = self.request_serializer_class(data=self.get_data())
        arg_serializer.is_valid(raise_exception=True)

        date = arg_serializer.validated_data['date']
        company_id = self.get_company_id()
        return Balance.for_date(company_id, date)


class BalanceByDateRangeView(ManyMixin, ByDateRangeMixin, RetrieveView):
    """Get a balance for a company by date range."""
    serializer_class = BalanceSerializer

    def get_object(self):
        start_date, end_date = self.get_date_range()
        company_id = self.get_company_id()
        return Balance.for_date_range(company_id, start_date, end_date)


class MonthView(RetrieveView):
    """Get a month for a company by year and month number."""
    serializer_class = MonthSerializer
    request_serializer_class = MonthYearSerializer

    def get_object(self):
        company_id = self.get_company_id()
        serializer = self.request_serializer_class(data=self.get_data())
        serializer.is_valid(raise_exception=True)

        year = serializer.data['year']
        month = serializer.data['month']

        try:
            return Month.get(company_id, year, month)
        except ValueError:
            raise ParseError('Invalid arguments')


class MonthByDateRangeView(ManyMixin, ByDateRangeMixin, RetrieveView):
    """Get a month for a company by date range."""
    serializer_class = MonthSerializer

    def get_object(self):
        company_id = self.get_company_id()
        start_date, end_date = self.get_date_range()

        return Month.for_date_range(company_id, start_date, end_date)
