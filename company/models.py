from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=50, unique=True)
    orgNr = models.CharField(max_length=20, unique=True)

    class Meta:
        verbose_name = 'company'
        verbose_name_plural = 'companies'
        ordering = ('name',)

    def __str__(self):
        return self.name
