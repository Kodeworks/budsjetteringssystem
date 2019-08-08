from django.contrib import admin

from custom_auth.models import UserCompanyThrough
from .models import Company


class UserInline(admin.StackedInline):
    model = UserCompanyThrough


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    inlines = (UserInline,)
    search_fields = ('name', 'org_nr')
    list_display = ('name', 'org_nr')
