from base.views import ListView, RetrieveCreateUpdateDestroyView, ByDateRangeView
from base.mixins import CompanyFilterMixin
from .serializers import TransactionSerializer
from .models import Transaction, TransactionStaticData

# TODO: Implement logic when mixins are pushed


class TransactionMixin(CompanyFilterMixin):
    lookup_field = 'id'
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class TransactionView(TransactionMixin, RetrieveCreateUpdateDestroyView):
    pass


class TransactionAllView(TransactionMixin, ListView):
    pass


class TransactionByDateView(TransactionMixin, ListView):
    def get_queryset(self):
        data = self.get_data()
        return super().get_queryset().filter(date=data['date'])


class TransactionByDateRangeView(TransactionMixin, ByDateRangeView):
    pass


class TransactionIncomeAllView(TransactionMixin, ListView):
    def get_queryset(self):
        return super().get_queryset().filter(type=TransactionStaticData.INCOME)


class TransactionExpenseAllView(TransactionMixin, ListView):
    def get_queryset(self):
        return super().get_queryset().filter(type=TransactionStaticData.EXPENSE)
