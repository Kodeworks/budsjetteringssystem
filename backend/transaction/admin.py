from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    search_fields = ('company', 'date', 'type')
    list_display = ('company', 'date', 'type', 'money')
