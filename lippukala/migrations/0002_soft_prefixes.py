# Generated by Django 1.9.4 on 2016-03-25 11:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lippukala', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='code',
            name='prefix',
            field=models.CharField(blank=True, editable=False, max_length=16),
        ),
    ]
