from django.db import models
from company.models import Company



class Transaction(models.Model):

    # Constants for use in Transaction model
    INCOME = 'IN'
    EXPENSE = 'EX'
    TRANSACTION_CHOICES = (
        (INCOME, 'income'),
        (EXPENSE, 'expense'),
    )

    company = models.ForeignKey(
        Company,
        related_name='transactions',
        on_delete=models.CASCADE,
    )

    date = models.DateField()
    money = models.IntegerField()
    type = models.CharField(max_length=2, choices=TRANSACTION_CHOICES)
    description = models.TextField()
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-date']