from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'money', 'type', 'description', 'notes', 'date', 'company', 'recurring_transaction')
