# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import resolve
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from feedback_parser import FeedbackParser

from random import sample
from collections import defaultdict
from os import listdir, curdir, path
from .models import Image, Keyword, Statistics, ClfModel, Label, ClusterModel, ImageCluster

import numpy as np
import pandas as pd

from recommend import get_relevant_imgs
from pathing_utils import path_to_root, \
    path_to_image_absolute, \
    path_to_image_frontend, \
    path_to_static, \
    path_to_images_folder_absolute, \
    image_name_from_path
import math

indices_euclidean_path = path_to_static() + "indices_euclidean.csv"
INDICIES = np.genfromtxt(indices_euclidean_path, delimiter=',', dtype=str)
# INDICIES = INDICIES[:1000]

distances_euclidean_path = path_to_static() + "distances_euclidean.csv"
DISTANCES = np.genfromtxt(distances_euclidean_path, delimiter=',')
# DISTANCES = DISTANCES[:1000]

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


def get_random_images(count=20):
    """Get image titles from DB

    :return: list of strings
    """
    # TODO: take random images from ClusterImage ==============================================

    images = Image.objects.all()
    subset = sample(images, count)
    print (subset)
    print("get random", count, "images. result ->", len(subset))
    return [i.title for i in subset]


def keyword_exists(k):
    """Check if keyword have been searched before

    :param k: string, search keyword
    :return: boolean
    """
    q = Keyword.objects.filter(keyword__exact=k)
    if not q:
        return False
    return True



def ci_lower_bound(positive, total, confidence = 0.95):
    """

    :param positive: number of positive votes
    :param total: total number of votes
    :param confidence: confidence interval
    :return:
    """
    #http://www.evanmiller.org/how-not-to-sort-by-average-rating.html

    if total == 0 or positive > total:
        return 0

    if positive == 0:
        return -1.0*total

    z = 1.96#Statistics2.pnormaldist(1-(1-confidence)/2)
    phat = 1.0*positive/total
    return (phat + z*z/(2*total) - z * math.sqrt((phat*(1-phat)+z*z/(4*total))/total))/(1+z*z/total)


def get_relevant_images_based_on_feedback(q, _df_feedback, count=20, upper_threshold=0.5, threshold_steps=3, lower_threshold=0.125):
    filtered = _df_feedback.loc[_df_feedback['query'] == q]
    unique_images = filtered['image'].unique().tolist()
    ratio_list = []
    for image in unique_images:
        total_times_shown = len(filtered.loc[filtered['image'] == image])
        times_selected = len(filtered.loc[(filtered['image'] == image) & (filtered['status'] == 1)])
        ratio = ci_lower_bound(times_selected, total_times_shown)
        ratio_list.append(ratio)
    ratio_df = pd.DataFrame({'image': unique_images, 'ratio': ratio_list})
    negative_ratio_list = ratio_df.loc[ratio_df['ratio'] < -2]['image'].tolist() #TODO: CHange when we have show more

    threshold_decrement = (upper_threshold - lower_threshold)/threshold_steps
    current_threshold = upper_threshold
    threshold_ratio_df = pd.DataFrame({}, columns=['image', 'ratio'])
    length = 0
    i = 1
    while current_threshold >= lower_threshold and length < count:
        ddf = ratio_df.loc[ratio_df['ratio'] >= current_threshold]
        ddf.sort_values(by='ratio', ascending=False, inplace=True)
        ddf_len = len(ddf)
        if ddf_len > 0:
            threshold_ratio_df = pd.concat([threshold_ratio_df, ddf])
            length += min(ddf_len, count/i)
            ratio_df = ratio_df.ix[ratio_df['ratio'] < current_threshold]
        i += 1
        current_threshold -= threshold_decrement

    length = min(20, length)
    if length == 0:
        # TODO: count those pics that were not selected to fetch images far from them
        return None

    images = threshold_ratio_df.head(length)['image']

    needed = count - length
    similar = get_similar_filter_negative(images, negative_ratio_list, count)
    ret_val = []
    for i in images:
        ret_val.append(i)

    filtered_similar = [item for item in similar if item not in ret_val][:needed]
    ret_val.extend(filtered_similar)
    return ret_val


def get_similar_filter_negative(images, filter_images, at_least_count):
    """
    
    :param images: images list according to which similar images are retrieved
    :param filter_images: list of images to exclude from return
    :param at_least_count: min number of images to retrieve
    :return: 
    """
    k = len(filter_images) + at_least_count
    similar = get_relevant_imgs(images, INDICIES, DISTANCES,
                                k, form="list", rank=True, img_dir=path_to_images_folder_absolute())
    similar = map(lambda x: image_name_from_path(x), similar)
    return [item for item in similar if item not in filter_images]


def get_similar_based_on_feedback(q, images, _df_feedback, count=20):
    filtered = _df_feedback.loc[_df_feedback['query'] == q]
    unique_images = filtered['image'].unique().tolist()
    ratio_list = []
    for image in unique_images:
        total_times_shown = len(filtered.loc[filtered['image'] == image])
        times_selected = len(filtered.loc[(filtered['image'] == image) & (filtered['status'] == 1)])
        ratio = ci_lower_bound(times_selected, total_times_shown)
        ratio_list.append(ratio)
    ratio_df = pd.DataFrame({'image': unique_images, 'ratio': ratio_list})
    negative_ratio_list = ratio_df.loc[ratio_df['ratio'] < -2]['image'].tolist()
    return get_similar_filter_negative(images, negative_ratio_list, count)


class SearchView(APIView):

    def __init__(self):
        self.feedback_parser = FeedbackParser()

    def format_response(self, query, step, images):
        return {
            "step": step,
            "query": query,
            "images": [path_to_image_frontend(img) for img in images],
            "ok": True
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

            if keyword_exists(query):
                print("Keyword exists")
                images = get_relevant_images_based_on_feedback(query, self.feedback_parser.df_feedback)
                if images is None:
                    images = get_random_images(20)
                return Response(self.format_response(query, 0, images))

            else:
                print("Send random")
                print("SHOW known_words")
                print(known_words.keys()[:10])

                temp_res = known_words.get(query)
                if temp_res:
                    print("USE KNOWN WORDS")
                    temp_res = sorted(temp_res, key=lambda x: x[1], reverse=True)
                    _imgs = []
                    for img, score in temp_res:
                        _imgs.append(img)

                    print("GET SIMILAR IMAGES")
                    similar_images = get_similar_based_on_feedback(query, _imgs[:10],
                                                                   self.feedback_parser.df_feedback, 20)
                    return Response(self.format_response(query, 0, similar_images))

                Keyword(keyword=query).save()
                images = get_random_images(20)
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
                random_images = get_random_images(20)
                return Response(self.format_response(query, step+1, random_images))

            similar_images = get_similar_based_on_feedback(query, selected_images, self.feedback_parser.df_feedback, 20)
            return Response(self.format_response(query, step+1, similar_images))

        return Response({"error": "post error"})
