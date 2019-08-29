from datetime import date
from base.views import ListView, RetrieveCreateUpdateDestroyView, ByDateRangeView
from base.mixins import CompanyFilterMixin
from .serializers import TransactionSerializer, RecurringTransactionSerializer
from .models import Transaction, TransactionStaticData, RecurringTransaction


class TransactionMixin(CompanyFilterMixin):
    lookup_field = 'id'
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class TransactionView(TransactionMixin, RetrieveCreateUpdateDestroyView):
    """Manage a transaction for a company."""
    pass


class TransactionAllView(TransactionMixin, ListView):
    """Get all transactions for a company."""
    pass


class TransactionByDateView(TransactionMixin, ListView):
    """Get all transactions for a company on a given date."""
    def get_queryset(self):
        data = self.get_data()
        return super().get_queryset().filter(date=data['date'])


class TransactionByDateRangeView(TransactionMixin, ByDateRangeView):
    """Get all transactions for a company in a given date range."""
    pass


class TransactionIncomeAllView(TransactionMixin, ListView):
    """Get all income transactions for a company."""
    def get_queryset(self):
        return super().get_queryset().filter(type=TransactionStaticData.INCOME)


class TransactionExpenseAllView(TransactionMixin, ListView):
    """Get all expense transactions for a company."""
    def get_queryset(self):
        return super().get_queryset().filter(type=TransactionStaticData.EXPENSE)


class RecurringTransactionMixin(CompanyFilterMixin):
    lookup_field = 'id'
    queryset = RecurringTransaction.objects.all()
    serializer_class = RecurringTransactionSerializer


class RecurringView(RecurringTransactionMixin, RetrieveCreateUpdateDestroyView):
    """Manage a recurring transaction for a company."""
    def perform_destroy(self, instance):
        instance.template.delete()
        super().perform_destroy(instance)


class RecurringAllView(RecurringTransactionMixin, ListView):
    """Get all recurring transactions for a company."""
    pass


class RecurringActive(RecurringTransactionMixin, ListView):
    """
    Get all recurring transactions for a company that currenctly active.
    A recurring transaction is active if the current date is between its
    `start_date` and `end_date`.
    """
    def get_queryset(self):
        return super().get_queryset().filter(start_date__lte=date.today(), end_date__gte=date.today())


# The two following can make use of code from month (do later).

class RecurringByDate(CompanyFilterMixin, ListView):
    pass


class RecurringByDateRange(CompanyFilterMixin, ListView):
    pass
