# Generated by Django 2.2.4 on 2019-08-27 17:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('balance', '0002_auto_20190627_1503'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bankbalance',
            name='date',
            field=models.DateField(help_text='The date the balance was recorded on'),
        ),
        migrations.AlterField(
            model_name='bankbalance',
            name='money',
            field=models.PositiveIntegerField(help_text='The amount of money available'),
        ),
    ]
