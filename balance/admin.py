from django.contrib import admin

from .models import BankBalance


@admin.register(BankBalance)
class BankBalanceAdmin(admin.ModelAdmin):
    search_fields = ('company', 'date')
    list_display = ('company', 'date', 'money')
    list_filter = ('company',)
