from base.views import RetrieveCreateUpdateDestroyView, ByDateRangeView, RetrieveView
from base.mixins import CompanyFilterMixin
from .models import BankBalance
from .serializers import BankBalanceSerializer


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
