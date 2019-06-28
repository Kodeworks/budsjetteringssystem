from base.views import ListView, CompanyAccessView, RetrieveCreateUpdateDestroyView
from base.mixins import CompanyFilterMixin
from .serializers import TransactionSerializer
from .models import Transaction

# TODO: Implement logic when mixins are pushed

class TransactionView(RetrieveCreateUpdateDestroyView):
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()
    # Overwrite to use company id as well? (or mixin)


class TransactionInsertArrayView(CompanyAccessView):
    # Wait a bit with this
    pass


class TransactionAllView(CompanyFilterMixin, ListView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class TransactionByDateView(ListView):
    pass

class TransactionByDateRangeView(CompanyAccessView):

    pass


class TransactionIncomeAllView(CompanyAccessView):
    pass


class TransactionExpenseAllView(CompanyAccessView):
    pass