# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class Image(models.Model):
    title = models.CharField(max_length=100)
    fc7_title = models.CharField(max_length=100)
    fc8_title = models.CharField(max_length=100)

    def __unicode__(self):
        return '%s' % (self.title)

    def __str__(self):
        return self.title, self.fc7_title, self.fc8_title


class Keyword(models.Model):
    keyword = models.CharField(max_length=200, primary_key=True)
    word2vec = models.CharField(max_length=300)

    def __str__(self):
        return self.keyword


class Statistics(models.Model):
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title


class ClfModel(models.Model):
    model_name = models.CharField(max_length=200)
    model_file = models.CharField(max_length=200)
    keyword_id = models.ForeignKey(Keyword)
    stat_id = models.ForeignKey(Statistics)

    def __str__(self):
        return self.model_name


class Label(models.Model):
    image_id = models.ForeignKey(Image, on_delete=models.CASCADE)
    keyword_id = models.ForeignKey(Keyword, on_delete=models.CASCADE)
    label = models.BooleanField()
    step_num = models.IntegerField()
    model_id = models.ForeignKey(ClfModel, on_delete=models.CASCADE)

    def __str__(self):
        return self.image_id, self.keyword_id, self.label, self.step_num, self.model_id


class ClusterModel(models.Model):
    name = models.CharField(max_length=100)
    size = models.IntegerField()

    def __str__(self):
        return self.name, self.size


class ImageCluster(models.Model):
    image_id = models.ForeignKey(Image)
    cluster_model_id = models.ForeignKey(ClusterModel)
    cluster_number = models.IntegerField()

    def __str__(self):
        return self.image_id, self.cluster_model_id, self.cluster_number
