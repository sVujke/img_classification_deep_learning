# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.urls import resolve
# from django.core.urlresolvers import resolve

from .models import Image, Keyword, Statistics, ClfModel, Label, ClusterModel, ImageCluster
from rest_framework.views import APIView
from rest_framework.response import Response

from os import listdir
from random import sample


def index(request):
    # images_list = Image.objects.all()
    # context = {'images_list': images_list, 'count': len(images_list)}
    # return render(request, 'index.html', context)
    return render(request, 'index.html', {})


def load_images_list():
    path_to_images = "/home/a/Desktop/Current Courses/Deep Learning 10" \
                     "/img_classification_deep_learning/frontend/public/images"
    images_titles = [f for f in listdir(path_to_images)]
    return images_titles


def get_images(count=20):
    """Get image titles from DB

    :return: list of strings
    """
    # TODO: take random images from ClusterImage

    images = Image.objects.all()
    subset = sample(images, count)
    print("get random", count, "images. result ->", len(subset))
    return ["images/" + i.title for i in subset]


def keyword_exists(k):
    """Check if keyword have been searched before

    :param k: string, search keyword
    :return: boolean
    """
    q = Keyword.objects.filter(keyword__exact=k)
    if not q:
        return False
    return True


def send_random(q):
    """Return dict with random images

    :param q: query string
    :return: dict
    """
    step = 0
    images = get_images()

    return {
        "step": step,
        "query": q,
        "images": images,
        "ok": True
    }


def save_feedback(d):
    pass


def read_feedback():
    pass


class SearchView(APIView):
    def get(self, request):
        url_name = resolve(self.request.path).url_name
        print("URL name", url_name)

        if url_name == 'search':
            print("GET", request.GET)
            query = request.GET.get('query')
            if not query or len(query) == 0:
                return Response()

            query = query.lower().strip()
            print("Search for", query)

            if keyword_exists(query):
                # TODO: return normal results
                print("Keyword exists")

                return Response(send_random(query))
                # return Response({"query": query})

            else:
                print("Send random")
                Keyword(keyword=query).save()
                return Response(send_random(query))

        elif url_name == 'update_images':
            print("get all images available for frontend")
            images_list = load_images_list()
            print("count images", len(images_list))
            print("first 10", images_list[:10])

            for img in images_list:
                if img.endswith(".jpg"):
                    Image(title=img).save()

            return Response({"status": "images stored",
                             "length": len(images_list)})

        elif url_name == 'remove_images_from_db':
            print("remove all images from DB")
            Image.objects.all().delete()
            print("done")
            print("retrieve all images - should be empty")
            imgs = Image.objects.all()
            print(len(imgs))
            print("done")

            return Response({"status": "images deleted"})

        else:
            pass

        return Response()

    def post(self, request):
        url_name = resolve(self.request.path).url_name
        print("URL name", url_name)

        if url_name == 'feedback':
            print("POST", request.POST)

            data = request.data
            print("Data", data)

            save_feedback(data)

        else:
            print("POST something else")

            data = request.data
            print("Data", data)

        return Response()
