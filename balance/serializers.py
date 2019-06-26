from rest_framework import serializers

from .models import BankBalance


class BankBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankBalance
        fields = ('id', 'date', 'money', 'company')

    def validate(self, *args, **kwargs):
        data = super().validate(*args, **kwargs)

        if not BankBalance.date_is_unique_for_company(data['company'], data['date'],
                                                      data['id'] if 'id' in data else None):
            raise serializers.ValidationError('There can only be one bank balance each day')

        return data
