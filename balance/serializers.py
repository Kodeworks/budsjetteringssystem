import datetime
from dataclasses import dataclass
from rest_framework import serializers

from base.serializers import LiquidatorSerializer
from base.validators import IDForeignKeyUniqueForDateValidator
from .models import BankBalance


@dataclass
class Balance:
    company_id: int
    date: datetime.date
    money: int


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
