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
    company_id = serializers.IntegerField(help_text='The ID of the company')
    date = serializers.DateField(help_text='The date the balance was calculated for')
    money = serializers.IntegerField(help_text='The balance on the given date')


class MonthYearSerializer(serializers.Serializer):
    year = serializers.IntegerField(help_text='The year')
    month = serializers.IntegerField(help_text='The month. Must be between 1 and 12')

    def validate_month(self, month):
        if not 1 <= month <= 12:
            raise serializers.ValidationError('Month must be between 1 and 12')

        return month


class MonthSerializer(MonthYearSerializer):
    start_balance = serializers.IntegerField(help_text='The incoming balance from the previous month')
    lowest_balance = BalanceSerializer(help_text='The lowest balance in the month. This can be the `start_balance`')
    transactions = TransactionSerializer(
        many=True,
        help_text='All transactions that occured in the month (includes recurring transactions that are changed)',
    )
    recurring = RecurringTransactionOccurenceSerializer(
        many=True,
        help_text='All recurring transactions that have occurences during the month',
    )
    balances = BalanceSerializer(many=True, help_text='The balances each day the balance changed')
    bank_balances = BankBalanceSerializer(many=True, help_text='All bank balances from the month')
