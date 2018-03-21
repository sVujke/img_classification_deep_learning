# coding: utf-8

# In[1]:

import pandas as pd
import numpy as np
from pathing_utils import image_name_from_path
from random import sample
from .models import Image
from utils import ci_lower_bound
from pathing_utils import path_to_static


indices_euclidean_path = path_to_static() + "indices_euclidean.csv"
INDICIES = np.genfromtxt(indices_euclidean_path, delimiter=',', dtype=str)
# INDICIES = INDICIES[:1000]

distances_euclidean_path = path_to_static() + "distances_euclidean.csv"
DISTANCES = np.genfromtxt(distances_euclidean_path, delimiter=',')
# DISTANCES = DISTANCES[:1000]


def index_from_image_name(image_path):
    return int(image_name_from_path(image_path).split(".jpg")[0])


def get_images_similar_to_image(img_name, indices, distances, k, form="df"):
    """ Returns list or df of k similar images, with or without path
        Parameters:
        1. img_name - "00001.jpg"
        2. img_map = {'0': '000000.jpg'}
        3. indices - nested np array with top 50 closest images for each image
        4. distances - nested np array with top 50 distances for each image
        5. k - 10 (number of images to be returned)
        6. form - returning df or list
        7. img_dir - path to directory of images
    """
    index = index_from_image_name(img_name)#get_key(img_map, img_name)
    distances = distances[index][1:k + 1]
    images = [str(x) for x in indices[index]][1:k + 1]

    if form == "df":
        return pd.DataFrame({"img": images, "dist": distances})
    elif form == "list":
        return images


def get_images_similar_to_images(img_lst, k, form="list", rank=True):
    """ Returns list or df of k similar images, with or without path
        Parameters:
        1. img_names - ["00001.jpg","00002.jpg"]
        2. img_map = {'0': '000000.jpg'}
        3. indices - nested np array with top 50 closest images for each image
        4. distances - nested np array with top 50 distances for each image
        5. k - 10 (number of images to be returned)
        6. form - returning df or list
        7. img_dir - path to directory of images
        8. rank - return ranked by distance or not
    """
    df_lst = []
    for img in img_lst:
        df_lst.append(get_images_similar_to_image(img, INDICIES, DISTANCES, k))

    df = pd.concat(df_lst)
    if rank:
        df = df.sort_values("dist")
        df = df.drop_duplicates('img')
    else:
        df = df.sample(k)
    if form == "list":
        print()
        return df.head(k)["img"].values
    elif form == "df":
        return df.head(k)


def random_images(count=20):
    """Get image titles from DB

    :return: list of strings
    """
    # TODO: take random images from ClusterImage ==============================================

    images = Image.objects.all()
    subset = sample(images, count)
    print (subset)
    print("get random", count, "images. result ->", len(subset))
    return [i.title for i in subset]


def __unique_image_ratio_df(query, df_feedback):
    """
    PRIVATE
    :return: DataFrame with all the unique images (Column = 'images') that were ever shown for the query
    and ratio of that image within this query (Column = 'ratio').
    """

    filtered = df_feedback.loc[df_feedback['query'] == query]
    unique_images = filtered['image'].unique().tolist()
    ratio_list = []
    for image in unique_images:
        total_times_shown = len(filtered.loc[filtered['image'] == image])
        times_selected = len(filtered.loc[(filtered['image'] == image) & (filtered['status'] == 1)])
        ratio = ci_lower_bound(times_selected, total_times_shown)
        ratio_list.append(ratio)
    return pd.DataFrame({'image': unique_images, 'ratio': ratio_list})


def __get_similar_and_filter_negative(images, image_filter, at_least_count):
    """
    PRIVATE
    :param images: images list according to which similar images are retrieved
    :param image_filter: list of images to exclude from return
    :param at_least_count: min number of images to retrieve
    :return: Similar images based on features that are not in image_filter
    """
    k = len(image_filter) + at_least_count
    similar = get_images_similar_to_images(images, k, form="list", rank=True)
    return [item for item in similar if item not in image_filter]


def relevant_images_based_on_feedback(query,
                                      df_feedback,
                                      count=20,
                                      upper_threshold=0.5,
                                      threshold_steps=3,
                                      lower_threshold=0.125):

    ratio_df = __unique_image_ratio_df(query, df_feedback)
    negative_ratio_list = ratio_df.loc[ratio_df['ratio'] < -2]['image'].tolist()  # TODO: CHange when we have show more

    threshold_decrement = (upper_threshold - lower_threshold) / threshold_steps
    current_threshold = upper_threshold
    threshold_ratio_df = pd.DataFrame({}, columns=['image', 'ratio'])

    length = 0
    i = 1
    while current_threshold >= lower_threshold and length < count:
        ddf = ratio_df.loc[ratio_df['ratio'] >= current_threshold]
        ddf = ddf.sort_values(by='ratio', ascending=False)
        ddf_len = len(ddf)
        if ddf_len > 0:
            threshold_ratio_df = pd.concat([threshold_ratio_df, ddf])
            length += min(ddf_len, count / i)
            ratio_df = ratio_df.ix[ratio_df['ratio'] < current_threshold]
        i += 1
        current_threshold -= threshold_decrement

    length = min(count, length)
    if length == 0:
        # TODO: count those pics that were not selected to fetch images far from them
        return None

    images = threshold_ratio_df.head(length)['image'].tolist()

    needed = count - length
    if needed > 0:
        similar = __get_similar_and_filter_negative(images, negative_ratio_list, count)
        filtered_similar = [item for item in similar if item not in images][:needed]
        images += filtered_similar

    return images


def similar_images_filter_negative_feedback(query, images, df_feedback, count=20):
    ratio_df = __unique_image_ratio_df(query, df_feedback)
    negative_ratio_list = ratio_df.loc[ratio_df['ratio'] < -2]['image'].tolist()
    return __get_similar_and_filter_negative(images, negative_ratio_list, count)
