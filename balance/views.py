from base.views import RetrieveCreateUpdateDestroyView, ByDateRangeView, RetrieveView
from .models import BankBalance
from .serializers import BankBalanceSerializer


class BankBalanceMixin:
    lookup_field = 'id'
    queryset = BankBalance.objects.all()
    serializer_class = BankBalanceSerializer


class BankBalanceView(BankBalanceMixin, RetrieveCreateUpdateDestroyView):
    pass


class BankBalanceByDateView(BankBalanceMixin, RetrieveView):
    lookup_field = 'date'


class BankBalanceByDateRangeView(BankBalanceMixin, ByDateRangeView):
    pass
