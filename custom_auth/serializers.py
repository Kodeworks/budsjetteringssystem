from rest_framework import serializers

from base.serializers import LiquidatorSerializer
from .models import User, UserCompanyThrough


class UserCompanyThroughSerializer(LiquidatorSerializer):
    class Meta:
        model = UserCompanyThrough
        fields = ('user', 'company', 'role')


class UserSerializer(serializers.ModelSerializer):
    companies = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'companies')
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def get_companies(self, obj):
        return UserCompanyThroughSerializer(UserCompanyThrough.objects.filter(user=obj), many=True).data

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
