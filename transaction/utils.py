from dateutil.rrule import rrule, DAILY, MONTHLY

from .models import RecurringTransaction


def get_recurring_occurences_in_date_range(recurring_transaction, start_date, end_date, include_created=True):
    # Avoid an infinite loop if the deltas are both invalid
    if recurring_transaction.day_delta < 1 and recurring_transaction.month_delta < 1:
        return []

    if end_date > recurring_transaction.end_date:
        end_date = recurring_transaction.end_date

    result = []
    created = [] if include_created else [transaction.date for transaction in recurring_transaction.transactions.all()]

    # Find the first occurence in the range, and work from there
    if recurring_transaction.month_delta:
        freq = MONTHLY
        interval = recurring_transaction.month_delta
    else:
        freq = DAILY
        interval = recurring_transaction.day_delta

    occurences = rrule(freq, interval=interval, dtstart=recurring_transaction.start_date, until=end_date)

    for occurence in occurences:
        occurence = occurence.date()
        if occurence >= start_date and (include_created or occurence not in created):
            result.append(occurence)

    return result


def get_all_recurring_occurences_in_date_range(company, start_date, end_date, include_created=True):
    result = []
    recurring_transactions = RecurringTransaction.objects.filter(
        company=company,
        start_date__lte=end_date,
        end_date__gte=start_date
    )

    for recurring in recurring_transactions:
        occurrences = get_recurring_occurences_in_date_range(recurring, start_date, end_date, include_created)
        if occurrences:
            result.append((recurring, occurrences))

    return result
