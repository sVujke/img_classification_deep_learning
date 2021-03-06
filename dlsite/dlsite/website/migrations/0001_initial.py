# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-10 12:55
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ClfModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('model_name', models.CharField(max_length=200)),
                ('model_file', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='ClusterModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('size', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('fc7_title', models.CharField(max_length=100)),
                ('fc8_title', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ImageCluster',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cluster_number', models.IntegerField()),
                ('cluster_model_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='website.ClusterModel')),
                ('image_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='website.Image')),
            ],
        ),
        migrations.CreateModel(
            name='Keyword',
            fields=[
                ('keyword', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('word2vec', models.CharField(max_length=300)),
            ],
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.BooleanField()),
                ('step_num', models.IntegerField()),
                ('image_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='website.Image')),
                ('keyword_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='website.Keyword')),
                ('model_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='website.ClfModel')),
            ],
        ),
        migrations.CreateModel(
            name='Statistics',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='clfmodel',
            name='keyword_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='website.Keyword'),
        ),
        migrations.AddField(
            model_name='clfmodel',
            name='stat_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='website.Statistics'),
        ),
    ]
