from datetime import date
from base.views import ListView, RetrieveCreateUpdateDestroyView, ByDateRangeView
from base.mixins import CompanyFilterMixin
from .serializers import TransactionSerializer, RecurringTransactionSerializer
from .models import Transaction, TransactionStaticData, RecurringTransaction

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


class RecurringTransactionMixin(CompanyFilterMixin):
    lookup_field = 'id'
    queryset = RecurringTransaction.objects.all()
    serializer_class = RecurringTransactionSerializer


class RecurringView(RecurringTransactionMixin, RetrieveCreateUpdateDestroyView):
    def perform_destroy(self, instance):
        instance.template.delete()
        super().perform_destroy(instance)


class RecurringAllView(RecurringTransactionMixin, ListView):
    pass


class RecurringActive(RecurringTransactionMixin, ListView):
    def get_queryset(self):
        return super().get_queryset().filter(end_date__gte=date.today())


# The two following can make use of code from month (do later).

class RecurringByDate(CompanyFilterMixin, ListView):
    pass


class RecurringByDateRange(CompanyFilterMixin, ListView):
    pass
