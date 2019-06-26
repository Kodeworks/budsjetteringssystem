from django.db import models
from django.core.exceptions import ValidationError

from company.models import Company


class BankBalance(models.Model):
    date = models.DateField()
    money = models.PositiveIntegerField()
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = 'bank balance'
        verbose_name_plural = 'bank balances'
        ordering = ('date',)

    def __str__(self):
        return f'{self.company}: {self.date}'

    def validate_unique(self, exclude=None):
        super().validate_unique(exclude)

        if not (exclude and 'date' in exclude):
            if not BankBalance.date_is_unique_for_company(self.company, self.date, self.pk):
                raise ValidationError({'date': 'There can only be one bank balance each day'})

    @classmethod
    def date_is_unique_for_company(cls, company, date, balance_id=None):
        """
        Check that there isn't a bank balance registered for the given company on the given date.

        If checking for an existing balance, pass balance_id to exclude it from the search.
        """
        return not BankBalance.objects.filter(company=company, date=date).exclude(pk=balance_id).exists()
