from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser

from company.models import Company


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password):
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, first_name, last_name, password):
        user = self.create_user(email, first_name, last_name, password)

        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractUser):
    username = None
    email = models.EmailField(
        max_length=255,
        unique=True,
    )
    company = models.ManyToManyField(
        Company,
        related_name='users',
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
