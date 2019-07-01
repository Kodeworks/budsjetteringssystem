from rest_framework import serializers

from base.serializers import LiquidatorSerializer
from base.validators import IDForeignKeyUniqueForDateValidator
from company.models import Company
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
