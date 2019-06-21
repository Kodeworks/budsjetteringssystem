from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser, Permission

from company.models import Company
from . import roles


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
    companies = models.ManyToManyField(
        Company,
        through='UserCompanyThrough',
        related_name='users',
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def get_company_through(self, company):
        """Get the object in the many-to-many relation to a company."""
        if isinstance(company, int):
            company_id = company
        elif isinstance(company, Company):
            company_id = company.pk
        else:
            return None

        through_model = self.companies.through
        try:
            return through_model.objects.get(company=company_id, user=self)
        except through_model.DoesNotExist:
            return None

    def get_role(self, company):
        """Get the role this user has in the given company."""
        through = self.get_company_through(company)

        return through.role if through else None

    def has_role(self, company, role):
        """
        Check that this user has a role in a company.

        Returns True if `role` is None.
        """
        if role is None:
            return True

        return roles.is_equivalent(self.get_role(company), role)


class UserCompanyThrough(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
    )
    role = models.CharField(
        choices=roles.choices,
        max_length=2,
        default=roles.USER,
    )
