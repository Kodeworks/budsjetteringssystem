from django.db import models
from company.models import Company


class TransactionStaticData(models.Model):
    INCOME = 'IN'
    EXPENSE = 'EX'
    TRANSACTION_CHOICES = (
        (INCOME, 'income'),
        (EXPENSE, 'expense'),
    )

    money = models.IntegerField()
    type = models.CharField(max_length=2, choices=TRANSACTION_CHOICES)
    description = models.TextField()
    notes = models.TextField(blank=True)

    class Meta:
        abstract = True


class Transaction(TransactionStaticData):
    date = models.DateField()
    company = models.ForeignKey(
        Company,
        related_name='transactions',
        on_delete=models.CASCADE,
    )
    recurring_transaction = models.ForeignKey(
        'RecurringTransaction',
        related_name='transactions',
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.date}:{self.description}"

    class Meta(TransactionStaticData.Meta):
        ordering = ['date']


class RecurringTransaction(models.Model):
    day_delta = models.PositiveIntegerField()
    month_delta = models.PositiveIntegerField()
    start_date = models.DateField()
    end_date = models.DateField()

    company = models.ForeignKey(
        Company,
        related_name='recurring_transactions',
        on_delete=models.CASCADE,
    )
    template = models.OneToOneField(
        'TransactionTemplate',
        on_delete=models.CASCADE,
    )


class TransactionTemplate(TransactionStaticData):
    pass
