from rest_framework import serializers

from base.serializers import LiquidatorSerializer
from base.validators import IDForeignKeyUniqueForDateValidator
from transaction.serializers import TransactionSerializer, RecurringTransactionOccurenceSerializer
from .models import BankBalance


class BankBalanceSerializer(LiquidatorSerializer):
    class Meta:
        model = BankBalance
        fields = ('id', 'date', 'money', 'company')

        validators = [
            IDForeignKeyUniqueForDateValidator(
                queryset=BankBalance.objects.all(),
                field='company',
                date_field='date',
            )
        ]


class BalanceSerializer(serializers.Serializer):
    company_id = serializers.IntegerField()
    date = serializers.DateField()
    money = serializers.IntegerField()


class MonthSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    start_balance = serializers.IntegerField()
    lowest_balance = serializers.IntegerField()
    transactions = TransactionSerializer(many=True)
    recurring = RecurringTransactionOccurenceSerializer(many=True)
    balances = BalanceSerializer(many=True)
    corrections = BankBalanceSerializer(many=True)
