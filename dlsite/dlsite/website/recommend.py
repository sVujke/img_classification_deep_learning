# coding: utf-8

# In[1]:

import pandas as pd
import numpy as np
from IPython.display import Image, display
from os import listdir
from os.path import isfile, join
from views import get_similar_images, PATH_TO_IMAGES_FRONTEND
import math


def load_img_names(path):
    """ Returns list of img names on specified path
    """
    images = [f for f in listdir(path) if isfile(join(path, f))]
    df = pd.DataFrame(images)
    df.columns = ["img"]
    df = df.sort_values("img")
    return df["img"].values


def get_img_map(img_names):
    """ Maps ordererd integer values to image names, example img  2 > 000002.jpg, 45 > 000045.jpg
    """
    img_map = {}
    for i in range(0, len(img_names)):
        img_map[i] = img_names[i]
    return img_map


def get_key(dic, dic_val):
    """ Returns key for value in dictionary
    """
    for k, v in dic.items():  # for name, age in list.items():  (for Python 3.x)
        if v == dic_val:
            return k


def get_similar_imgs(img_name, img_map, indices, distances, k, form="df", img_dir=None):
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
    print("+" * 30)
    # print(img_map)
    print(img_name)
    index = get_key(img_map, img_name)
    print('index', index)
    distances = distances[index][1:k + 1]
    print(distances)
    print('img_dir', img_dir)

    if img_dir is None:
        images = [x for x in indices[index]]
    else:
        images = [str(img_dir) + str(x) for x in indices[index]]

    images = images[1:k + 1]

    if form == "df":
        return pd.DataFrame({"img": images, "dist": distances})
    elif form == "list":
        return images


# In[14]:

# get_similar_imgs("000123.jpg", img_map,indices, distances, 10, form="list", img_dir="patka/")


# In[15]:

def get_relevant_imgs(img_lst, img_map, indices, distances, k, form="list", rank=True, img_dir=None):
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
        df_lst.append(get_similar_imgs(img, img_map, indices, distances, k, img_dir=img_dir))

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


# In[16]:

def display_img(img_dir, img):
    """ Displays an image
    """
    display(Image(img_dir + img))


# In[17]:

def display_imgs(img_dir, img_list):
    """ Displays images from the list
    """
    for img in img_list:
        display_img(img_dir, img)


def ci_lower_bound(positive, total, confidence = 0.95):
    """

    :param positive: number of positive votes
    :param total: total number of votes
    :param confidence: confidence interval
    :return:
    """
    #http://www.evanmiller.org/how-not-to-sort-by-average-rating.html

    if total == 0:
        return 0

    z = 1.96#Statistics2.pnormaldist(1-(1-confidence)/2)
    phat = 1.0*positive/total
    return (phat + z*z/(2*total) - z * math.sqrt((phat*(1-phat)+z*z/(4*total))/total))/(1+z*z/total)


def get_relevant_images_based_on_feedback(q, _df_feedback):
    filtered = _df_feedback.loc[_df_feedback['query'] == q]
    unique_images = filtered['image'].unique().tolist()
    ratio_list = []
    for image in unique_images:
        total_times_shown = len(filtered.loc[filtered['image'] == image])
        times_selected = len(filtered.loc[(filtered['image'] == image) & (filtered['status'] == 1)])
        ratio = ci_lower_bound(times_selected, total_times_shown)
        ratio_list.append(ratio)
    ratio_df = pd.DataFrame({'image': unique_images, 'ratio': ratio_list})
    ratio_df = ratio_df.loc[ratio_df['ratio'] > 0]
    ratio_df.sort_values(by='ratio', ascending=False, inplace=True)
    length = min(len(ratio_df), 5)
    if length == 0:
        # TODO: count those pics that were not selected to fetch images far from them
        return None

    images = ratio_df.head(length)['image']

    needed = 20 - length
    similar = get_similar_images(images, 20)
    similar = map(lambda x: PATH_TO_IMAGES_FRONTEND + x.split('/')[-1], similar)
    ret_val = []
    for i in images:
        ret_val.append(PATH_TO_IMAGES_FRONTEND + i)

    filtered_similar = [x for x in similar if x not in ret_val][:needed]
    ret_val.extend(filtered_similar)
    return ret_val