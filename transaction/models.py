from dateutil.rrule import rrule, DAILY, MONTHLY
from django.db import models

from company.models import Company


class TransactionStaticData(models.Model):
    INCOME = 'IN'
    EXPENSE = 'EX'
    TRANSACTION_CHOICES = (
        (INCOME, 'income'),
        (EXPENSE, 'expense'),
    )

    money = models.IntegerField(help_text='The amount of money transferred in the transaction')
    type = models.CharField(max_length=2, choices=TRANSACTION_CHOICES,
                            help_text='The type of transaction (income or expense)')
    description = models.TextField(help_text='A short description of what the transaction is for')
    notes = models.TextField(blank=True, help_text='A longer description and details about the transaction')

    class Meta:
        abstract = True


class Transaction(TransactionStaticData):
    date = models.DateField(help_text='The date of the transaction')
    company = models.ForeignKey(
        Company,
        related_name='transactions',
        on_delete=models.CASCADE,
        help_text='The company'
    )
    recurring_date = models.DateField(null=True, blank=True)
    recurring_transaction = models.ForeignKey(
        'RecurringTransaction',
        related_name='transactions',
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
        help_text='The associated recurring transaction, if applicable',
    )

    def __str__(self):
        return f"{self.date}:{self.description}"

    class Meta(TransactionStaticData.Meta):
        ordering = ['date']


class RecurringTransaction(models.Model):
    DAY = 'DA'
    MONTH = 'MO'
    INTERVAL_CHOICES = (
        (DAY, 'day'),
        (MONTH, 'month'),
    )

    interval = models.PositiveIntegerField(help_text='The interval between each occurrence')
    interval_type = models.CharField(
        max_length=2,
        choices=INTERVAL_CHOICES,
        help_text='The value which the interval should operate on'
    )
    start_date = models.DateField(help_text='The day of the first occurence')
    end_date = models.DateField(
        help_text="The last day there can be an occurence. Doesn't have to be the date of an occurence"
    )

    company = models.ForeignKey(
        Company,
        related_name='recurring_transactions',
        on_delete=models.CASCADE,
        help_text='The company that has this recurring transaction',
    )
    template = models.OneToOneField(
        'TransactionTemplate',
        on_delete=models.CASCADE,
        help_text='The template for the transaction occurences'
    )

    def get_occurences(self, start_date, end_date, include_created=True):
        # Avoid an infinite loop if the deltas are both invalid
        if self.interval == 0:
            return []

        if end_date > self.end_date:
            end_date = self.end_date

        result = []
        changed = {t.recurring_date: t.date for t in self.transactions.exclude(recurring_date=None)}
        created = [] if include_created else [transaction.recurring_date or transaction.date
                                              for transaction in self.transactions.all()]

        # Find the first occurence in the range, and work from there
        if self.interval_type == self.MONTH:
            freq = MONTHLY
        elif self.interval_type == self.DAY:
            freq = DAILY

        occurences = rrule(freq, interval=self.interval, dtstart=self.start_date, until=end_date)

        for occurence in occurences:
            occurence = occurence.date()
            if occurence in changed and include_created:
                occurence = changed[occurence]

            if occurence >= start_date and (include_created or occurence not in created):
                result.append(occurence)

        return result

    @classmethod
    def get_all_occurences(cls, company, start_date, end_date, include_created=True):
        result = []
        recurring_transactions = cls.objects.filter(
            company=company,
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        for recurring in recurring_transactions:
            occurrences = recurring.get_occurences(start_date, end_date, include_created)
            if occurrences:
                result.append((recurring, occurrences))

        return result


class TransactionTemplate(TransactionStaticData):
    pass
