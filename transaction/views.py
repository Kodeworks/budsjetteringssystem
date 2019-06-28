from base.views import ListView
from .serializers import TransactionSerializer
from .models import Transaction


class TransactionAllView(ListView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
