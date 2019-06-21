from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        # This attribute is required for the form to work, but it will
        # be overwritten by the UserAdmin
        fields = ('email',)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = UserForm
    add_form = UserForm

    list_display = ('email', 'first_name', 'last_name', 'is_active')
    list_filter = ('is_active', 'companies')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-is_active', 'first_name', 'last_name')

    filter_horizontal = ('companies',)

    # Fieldsets for the change-user form
    fieldsets = (
        (None, {
            'fields': ('email', 'password', 'first_name', 'last_name', 'is_superuser')
        }),
    )

    # Fieldsets for the add-user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'first_name', 'last_name')
        }),
    )
