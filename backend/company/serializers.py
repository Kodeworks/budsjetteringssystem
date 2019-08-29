from rest_framework import serializers

from base.serializers import LiquidatorSerializer
from custom_auth.models import UserCompanyThrough
from custom_auth.serializers import UserCompanyThroughSerializer
from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    users = serializers.SerializerMethodField(read_only=True, help_text='The users in the company')

    class Meta:
        model = Company
        fields = ('id', 'name', 'org_nr', 'users')

    def get_users(self, obj):
        return UserCompanyThroughSerializer(UserCompanyThrough.objects.filter(company=obj), many=True).data


class AddUserToCompanySerializer(LiquidatorSerializer):
    email = serializers.EmailField(help_text='The email of the user to add to the company')

    class Meta:
        model = UserCompanyThrough
        fields = ('email', 'company', 'role')
