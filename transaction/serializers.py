import datetime
from typing import List
from dataclasses import dataclass
from rest_framework import serializers
from .models import Transaction, RecurringTransaction, TransactionTemplate


@dataclass
class RecurringTransactionOccurence:
    object: Transaction
    dates: List[datetime.date]


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'money', 'type', 'description', 'notes', 'date', 'company', 'recurring_transaction')


class TransactionTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionTemplate
        fields = ('id', 'money', 'type', 'description', 'notes')


class RecurringTransactionSerializer(serializers.ModelSerializer):
    template = TransactionTemplateSerializer()

    class Meta:
        model = RecurringTransaction
        fields = ('id', 'day_delta', 'month_delta', 'start_date', 'end_date', 'company', 'template')


class RecurringTransactionOccurenceSerializer(serializers.Serializer):
    object = RecurringTransactionSerializer()
    dates = serializers.ListField(child=serializers.DateField())
