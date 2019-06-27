from rest_framework import serializers
from rest_framework.validators import UniqueForDateValidator

from .models import BankBalance


class BankBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankBalance
        fields = ('id', 'date', 'money', 'company')

        # Does the same as BankBalance.validate_unique
        validators = [
            UniqueForDateValidator(
                queryset=BankBalance.objects.all(),
                field='company',
                date_field='date',
            )
        ]
