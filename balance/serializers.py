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


class MonthYearSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    month = serializers.IntegerField()

    def validate_month(self, month):
        if not 1 <= month <= 12:
            raise serializers.ValidationError('Month must be between 1 and 12')

        return month


class MonthSerializer(serializers.Serializer):
    year = serializers.IntegerField()
    month = serializers.IntegerField()
    start_balance = serializers.IntegerField()
    lowest_balance = BalanceSerializer()
    transactions = TransactionSerializer(many=True)
    recurring = RecurringTransactionOccurenceSerializer(many=True)
    balances = BalanceSerializer(many=True)
    bank_balances = BankBalanceSerializer(many=True)
