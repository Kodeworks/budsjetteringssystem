from django.db import models
from django.core.exceptions import ValidationError

from company.models import Company


class BankBalance(models.Model):
    date = models.DateField()
    money = models.PositiveIntegerField()
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        unique_for_date='date',
    )

    class Meta:
        verbose_name = 'bank balance'
        verbose_name_plural = 'bank balances'
        ordering = ('date',)

    def __str__(self):
        return f'{self.company}: {self.date}'
