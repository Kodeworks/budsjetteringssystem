from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, UserCompanyThrough


class UserCreationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'is_superuser')

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    new_password = forms.CharField(label='New password', required=False, widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email', 'is_active', 'is_superuser')

    def save(self, commit=True):
        user = super().save(commit=False)

        password = self.cleaned_data.get('new_password')
        if password:
            user.set_password(password)

        if commit:
            user.save()

        return user


class CompanyInline(admin.StackedInline):
    model = UserCompanyThrough


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (CompanyInline,)
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('email', 'first_name', 'last_name', 'is_active')
    list_filter = ('is_active', 'companies')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-is_active', 'first_name', 'last_name')

    # Fieldsets for the change-user form
    fieldsets = (
        (None, {
            'fields': ('email', 'new_password', 'first_name', 'last_name', 'is_superuser')
        }),
    )

    # Fieldsets for the add-user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'first_name', 'last_name')
        }),
    )
