from custom_auth.views import CompanyAccessView
from .serializers import TransactionSerializer
from .models import Transaction
from rest_framework import mixins


class TransactionAllView(mixins.ListModelMixin, CompanyAccessView):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        company_id = self.get_data(self.request)[self.company_id_field]
        return Transaction.objects.filter(company=company_id)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
