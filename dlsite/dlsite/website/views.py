# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.urls import resolve
# from django.core.urlresolvers import resolve

from .models import Image, Keyword, Statistics, ClfModel, Label, ClusterModel, ImageCluster
from rest_framework.views import APIView
from rest_framework.response import Response


def index(request):
    # images_list = Image.objects.all()
    # context = {'images_list': images_list, 'count': len(images_list)}
    # return render(request, 'index.html', context)
    return render(request, 'index.html', {})


def get_images():
    """Get image titles from DB

    :return: list of strings
    """
    # TODO: take random images from ClusterImage

    images = Image.objects.all()
    return [i.title for i in images]


def keyword_exists(k):
    """Check if keyword have been searched before

    :param k: string, search keyword
    :return: boolean
    """
    q = Keyword.objects.filter(keyword__exact=k)
    if not q:
        return False
    return True


def return_random(q):
    """Return Response with random images

    :param q: query string
    :return: JSONResponse
    """
    step = 0
    images = get_images()
    print(images)

    return Response({
        "step": step,
        "query": q,
        "images": images
    })


class SearchView(APIView):
    def get(self, request):
        url_name = resolve(self.request.path).url_name
        print("URL name", url_name)

        if url_name == 'search':
            print("GET", request.GET)
            query = request.GET.get('q')
            query = query.lower().strip()
            print("Search for", query)
            if len(query) == 0:
                return Response()

            if keyword_exists(query):
                print("Keyword exists")
                return Response({"query": query})

            else:
                Keyword(keyword=query).save()
                return return_random(query)
            
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

        else:
            pass
            data = request.data
            print(data)

        return Response()
