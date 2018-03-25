# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import resolve
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from feedback_parser import FeedbackParser
from search_history import SearchHistory

from collections import defaultdict
from os import listdir, curdir, path
from .models import Image, Keyword, Statistics, ClfModel, Label, ClusterModel, ImageCluster

import pandas as pd
from recommend import relevant_images_based_on_feedback, random_images, similar_images_filter_negative_feedback

from pathing_utils import path_to_image_frontend, \
    path_to_static, \
    path_to_images_folder_absolute, \
    image_name_from_path


inception_layer_path = path_to_static() + "inception_output_layer2"
print("READ inception_layer_path")
df_in = pd.read_pickle(inception_layer_path)
df_in.columns = ['img', 'output_layer', 'scores']
print("DROP column - output_layer")
df_in.drop('output_layer', axis=1, inplace=True)
print(df_in.head())
known_words = defaultdict(list)


def prepare_known_words():
    global df_in, known_words
    print("create dict of known words")
    rows = df_in.shape[0]
    for i in range(rows):
        row = df_in.iloc[i]
        img_title = row['img']
        descriptions_list = row['scores'].items()
        for d, score in descriptions_list:
            for word in d.split(' '):
                word = word.replace(",", "")
                known_words[word].append((img_title, score))

    print('==================== known_words', len(known_words))
    print("del df_in")
    del df_in
    print("done")
prepare_known_words()


def index(request):
    # images_list = Image.objects.all()
    # context = {'images_list': images_list, 'count': len(images_list)}
    # return render(request, 'index.html', context)
    return render(request, 'index.html', {})


def load_images_list():
    images_titles = [f for f in listdir(path_to_images_folder_absolute()) if f.endswith(".jpg")]
    images_titles = sorted(images_titles, reverse=False)
    return images_titles


def keyword_exists(k):
    """Check if keyword have been searched before

    :param k: string, search keyword
    :return: boolean
    """
    q = Keyword.objects.filter(keyword__exact=k)
    if not q:
        return False
    return True


class SearchView(APIView):

    def __init__(self):
        self.feedback_parser = FeedbackParser()
        self.search_history = SearchHistory()

    def format_response(self, query, step, images):
        return {
            "step": step,
            "query": query,
            "images": [path_to_image_frontend(img) for img in images],
            "ok": True,
            "synonyms": []
        }

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

            print("STEP:", self.feedback_parser.get_step(query))

            self.search_history.search_history_update(query)
            print("UPDATED search history for query: ", query)

            if keyword_exists(query):
                print("Keyword exists")
                images = relevant_images_based_on_feedback(query, self.feedback_parser.df_feedback)
                if images is None:
                    images = random_images(20)
                return Response(self.format_response(query, 0, images))

            else:
                print("SHOW known_words")
                print(known_words.keys()[:10])

                temp_res = known_words.get(query)
                Keyword(keyword=query).save()
                if temp_res:
                    print("USE KNOWN WORDS")
                    temp_res = sorted(temp_res, key=lambda x: x[1], reverse=True)
                    _imgs = []
                    for img, score in temp_res:
                        _imgs.append(img)

                    print("GET SIMILAR IMAGES")
                    similar_images = similar_images_filter_negative_feedback(query, _imgs[:10],
                                                                        self.feedback_parser.df_feedback, 20)
                    return Response(self.format_response(query, 0, similar_images))

                images = random_images(20)
                return Response(self.format_response(query, 0, images))

        elif url_name == 'update_images':
            print("get all images available for frontend")
            images_list = load_images_list()
            print("count images", len(images_list))
            print("first 10", images_list[:10])

            images_list = [img for img in images_list if img.endswith(".jpg")]
            bulk_list = [Image(title=img) for img in images_list]
            Image.objects.bulk_create(bulk_list)

            # for idx, img in enumerate(images_list):
            #     if idx % 100 == 0:
            #         print("======", idx)
            #     if img.endswith(".jpg"):
            #         Image(title=img).save()

            return Response({"status": "images stored",
                             "length": len(images_list)})

        elif url_name == 'remove_images_from_db':
            print("remove all images from DB")
            Image.objects.all().delete()
            print("done")
            print("retrieve all images - should be empty")
            print(len(Image.objects.all()))
            print("done")

            return Response({"status": "images deleted"})

        elif url_name == 'remove_prev_queries_from_db':
            print("remove previous queries from DB")
            Keyword.objects.all().delete()
            print("done")
            print("retrieve all keywords - should be empty")
            print(len(Keyword.objects.all()))
            print("done")

            return Response({"status": "keywords deleted"})

        else:
            pass

        return Response()

    def post(self, request):
        url_name = resolve(self.request.path).url_name
        print("POST REQUEST:", url_name)
        data = request.data
        print("Data", data)

        if url_name == 'feedback':
            query = data.get("query")
            step = data.get("step")
            selected_images = [image_name_from_path(img) for img in data.get("selectedImages")]
            not_selected_images = [image_name_from_path(img) for img in data.get("nonSelectedImages")]

            self.feedback_parser.save_feedback(query, step, selected_images, not_selected_images)

            if not selected_images:
                images = random_images(20)
            else:
                images = similar_images_filter_negative_feedback(query, selected_images, self.feedback_parser.df_feedback, 20)

            return Response(self.format_response(query, step+1, images))


        return Response({"error": "post error"})
