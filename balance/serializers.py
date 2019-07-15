import datetime
from typing import Any
from dataclasses import dataclass
from rest_framework import serializers

from base.serializers import LiquidatorSerializer
from base.validators import IDForeignKeyUniqueForDateValidator
from transaction.serializers import TransactionSerializer, RecurringTransactionOccurenceSerializer
from .models import BankBalance


@dataclass
class Balance:
    company_id: int
    date: datetime.date
    money: int


@dataclass
class Month:
    year: int
    month: int
    start_balance: int
    lowest_balance: int
    transactions: Any
    recurring: Any
    balances: Any
    corrections: Any


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
