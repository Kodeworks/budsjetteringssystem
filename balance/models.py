from django.db import models

from company.models import Company


class BankBalance(models.Model):
    date = models.DateField(help_text='The date the balance was recorded on')
    money = models.PositiveIntegerField(help_text='The amount of money available')
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
