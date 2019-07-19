from rest_framework import serializers
from base.serializers import LiquidatorSerializer
from .models import Transaction, RecurringTransaction, TransactionTemplate


class TransactionSerializer(LiquidatorSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'money', 'type', 'description', 'notes', 'date', 'company',
                  'recurring_transaction', 'recurring_date')


class TransactionTemplateSerializer(LiquidatorSerializer):
    class Meta:
        model = TransactionTemplate
        fields = ['id', 'money', 'type', 'description', 'notes']


class RecurringTransactionSerializer(LiquidatorSerializer):
    template = TransactionTemplateSerializer(many=False)

    class Meta:
        model = RecurringTransaction
        fields = ('id', 'interval', 'interval_type', 'start_date', 'end_date', 'transactions', 'company', 'template')
        read_only_fields = ['transactions']

    def create(self, validated_data):
        template_data = validated_data.pop('template')
        template = TransactionTemplate.objects.create(**template_data)
        return RecurringTransaction.objects.create(template=template, **validated_data)

    def update(self, instance, validated_data):
        TransactionTemplate.objects.filter(id=instance.template.id).update(**validated_data.pop('template'))
        return super(RecurringTransactionSerializer, self).update(instance, validated_data)

    def validate(self, data):
        """
        Makes sure start_date comes before end_date
        """
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError('Start date must occur before end date.')
        return super().validate(data)


class RecurringTransactionOccurenceSerializer(serializers.Serializer):
    object = RecurringTransactionSerializer()
    dates = serializers.ListField(child=serializers.DateField())
