import datetime
from typing import List
from dataclasses import dataclass

from .models import Transaction


@dataclass
class RecurringTransactionOccurence:
    object: Transaction
    dates: List[datetime.date]
