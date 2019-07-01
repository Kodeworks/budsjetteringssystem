from base.views import ListView
from base.mixins import CompanyFilterMixin
from .serializers import TransactionSerializer
from .models import Transaction


class TransactionAllView(CompanyFilterMixin, ListView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
