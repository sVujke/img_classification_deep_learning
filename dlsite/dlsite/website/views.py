# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import resolve
from django.conf import settings
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from random import sample
from os import listdir, curdir, path
from .models import Image, Keyword, Statistics, ClfModel, Label, ClusterModel, ImageCluster

import numpy as np
import pandas as pd
from recommend import get_relevant_images_rank, get_img_map

ABS_PATH = path.dirname(path.abspath(__file__))
FEEDBACK_FILE = ABS_PATH + settings.STATIC_URL + "feedback.csv"
FEEDBACK_COLS = ["query", "step", "image", "status"]
print("FEEDBACK_FILE:", FEEDBACK_FILE)

PATH_TO_IMAGES_FRONTEND = "mlimages/"
PATH_TO_IMAGES = "/home/a/Desktop/Current Courses/Deep Learning 10" \
                 "/all_images/"
                 # "/img_classification_deep_learning/frontend/public/images"

indices_euclidean_path = ABS_PATH + settings.STATIC_URL + "indices_euclidean.csv"
INDICIES = np.genfromtxt(indices_euclidean_path, delimiter=',')
# INDICIES = INDICIES[:1000]

distances_euclidean_path = ABS_PATH + settings.STATIC_URL + "distances_euclidean.csv"
DISTANCES = np.genfromtxt(distances_euclidean_path, delimiter=',')
# DISTANCES = DISTANCES[:1000]

IMG_MAP = None


def index(request):
    # images_list = Image.objects.all()
    # context = {'images_list': images_list, 'count': len(images_list)}
    # return render(request, 'index.html', context)
    return render(request, 'index.html', {})


def load_images_list():
    images_titles = [f for f in listdir(PATH_TO_IMAGES)]
    images_titles = sorted(images_titles, reverse=False)
    return images_titles


def get_images(count=20):
    """Get image titles from DB

    :return: list of strings
    """
    # TODO: take random images from ClusterImage

    images = Image.objects.all()
    subset = sample(images, count)
    print("get random", count, "images. result ->", len(subset))
    return [PATH_TO_IMAGES_FRONTEND + i.title for i in subset]


def keyword_exists(k):
    """Check if keyword have been searched before

    :param k: string, search keyword
    :return: boolean
    """
    q = Keyword.objects.filter(keyword__exact=k)
    if not q:
        return False
    return True


def format_response(query, step, images):
    return {
        "step": step,
        "query": query,
        "images": images,
        "ok": True
    }


def send_random(q):
    """Return dict with random images

    :param q: query string
    :return: dict
    """
    step = 0
    images = get_images()

    return format_response(q, step, images)


def save_feedback(d, _df_feedback):
    print("============================== run save_feedback")
    query = d.get("query")
    step = d.get("step")
    selected_img = d.get("selectedImages")
    not_selected_img = d.get("nonSelectedImages")
    print(query)
    print(step)
    print(selected_img)
    print(not_selected_img)

    res = []
    for img in selected_img:
        img_title = img.split("/")[-1]
        res.append([query, step, img_title, "1"])

    for img in not_selected_img:
        img_title = img.split("/")[-1]
        res.append([query, step, img_title, "0"])

    print("create df_tmp")
    df_tmp = pd.DataFrame(res)
    df_tmp.columns = FEEDBACK_COLS
    print("df_tmp head")
    print(df_tmp.head())
    print("append")
    _df_feedback = _df_feedback.append(df_tmp, ignore_index=True)
    print("save")
    _df_feedback.to_csv(FEEDBACK_FILE, index=False)

    return True


def read_feedback():
    if path.isfile(FEEDBACK_FILE):
        return pd.read_csv(FEEDBACK_FILE)

    df = pd.DataFrame({}, columns=FEEDBACK_COLS)
    df.to_csv(FEEDBACK_FILE, index=False)
    print("read_feedback")
    print(df)

    return df


def get_similar(d, k=10):
    global IMG_MAP

    print("run get_similar")
    if IMG_MAP is None:
        IMG_MAP = get_img_map(load_images_list())

    print("get selected_img")
    selected_img = [x.split("/")[-1] for x in d.get("selectedImages")]
    print(selected_img)

    print("IMG_MAP", len(IMG_MAP))
    print(IMG_MAP.items()[:10])
    print("INDICIES", len(INDICIES))
    print(INDICIES)
    print("DISTANCES", len(DISTANCES))
    print(DISTANCES)
    print("k")
    print(k)
    print("PATH_TO_IMAGES")
    print(PATH_TO_IMAGES)
    print("run get_relevant_images_rank")
    images_list = get_relevant_images_rank(selected_img, IMG_MAP, INDICIES, DISTANCES,
                                           k, operation="union", img_dir=PATH_TO_IMAGES)
    print("return", len(images_list))
    return images_list[:5]


class SearchView(APIView):

    def __init__(self):
        print("======================================== init")
        self.df_feedback = read_feedback()
        print(self.df_feedback.head())
        print("======================================== end init")

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

            save_feedback(data, self.df_feedback)
            similar_images = get_similar(data)
            similar_images = map(lambda x: PATH_TO_IMAGES_FRONTEND + x.split('/')[-1], similar_images)

            query = data.get("query")
            step = data.get("step")
            return Response(format_response(query, step + 1, similar_images))

        else:
            print("POST something else")

            data = request.data
            print("Data", data)

        return Response()
