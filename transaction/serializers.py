from rest_framework import serializers
from base.serializers import LiquidatorSerializer
from .models import Transaction, RecurringTransaction, TransactionTemplate


class TransactionSerializer(LiquidatorSerializer, serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'money', 'type', 'description', 'notes', 'date', 'company', 'recurring_transaction')


class TransactionTemplateSerializer(LiquidatorSerializer, serializers.ModelSerializer):
    class Meta:
        model = TransactionTemplate
        fields = ['id', 'money', 'type', 'description', 'notes']


class RecurringTransactionSerializer(LiquidatorSerializer, serializers.ModelSerializer):
    template = TransactionTemplateSerializer(many=False)

    class Meta:
        model = RecurringTransaction
        fields = ('id', 'day_delta', 'month_delta', 'start_date', 'end_date', 'transactions', 'company', 'template')
        read_only_fields = ['transactions']

    def create(self, validated_data):
        template_data = validated_data.pop('template')
        template = TransactionTemplate.objects.create(**template_data)
        return RecurringTransaction.objects.create(template=template, **validated_data)

    def update(self, instance, validated_data):
        #  TODO: Rewrite this?

        template_data = validated_data.pop('template')
        old_template = instance.template
        for attribute, value in template_data.items():
            setattr(old_template, attribute, value)
        old_template.save()
        return super(RecurringTransactionSerializer, self).update(instance, validated_data)

    def validate(self, data):
        """
        Makes sure start_date comes before end_date
        """
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError('Start date must occur before end date.')
        return data
