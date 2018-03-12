# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from IPython.display import Image, display
from os import listdir
from os.path import isfile, join
import random


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
    for k, v in dic.items():
        if v == dic_val:
            return k


def get_similar_imgs(img_name, img_map, indices, k, img_dir=None):
    """ Returns list of k similar images, with or without path (specify in imag_dir)
    """
    index = get_key(img_map, img_name)
    #     print(index)
    #     print(img_name)
    if img_dir == None:
        images = [img_map[x] for x in indices[index]]
    else:
        images = [img_dir + img_map[x] for x in indices[index]]
    return images[:k]


def get_similar_imgs_rank(img_name, img_map, indices, distances, k, img_dir=None):
    """ Returns list of k similar images, with or without path (specify in imag_dir)
    """
    print('run get_similar_imgs_rank')
    # print('img_map', img_map)
    print('img_name', img_name)
    index = get_key(img_map, img_name)
    print(index)
    if img_dir is None:
        images = [img_map[x] for x in indices[index]]
        distances = [x for x in distances[index]]
    else:
        images = [img_dir + img_map[x] for x in indices[index]]
        distances = [x for x in distances[index]]
    return images[:k], distances[:k]


# get_similar_imgs("000009.jpg", img_map, indices, 5)

def display_similar_for_img(img_dir, img_name, img_map, indices, disp_num):
    """ Displays top n similar images for specified img
    """
    images = get_similar_imgs(img_name, img_map, indices, disp_num, img_dir)
    for img in images:
        display(Image(img))


# display_similar_for_img(img_dir, "000009.jpg", img_map, indices,5)


# # Get similar images to chosen relevant images
def get_relevant_images_rank(img_lst, img_map, indices, distances, k, operation="union", img_dir=None):
    """ Returns an interseoction or union of similar images to a given list of images without a ranking
    """
    # k = k 
    set_lst = []
    helper = []
    helper2 = []
    for img in img_lst:
        ind_dist = get_similar_imgs_rank(img, img_map, indices, distances, k=k, img_dir=img_dir)

        helper.append(ind_dist[0])
        set_lst.append(ind_dist[1])
        helper2.append(set(ind_dist[0]))

    # distances = distances[:k]
    helper = sum(helper, [])
    set_lst = sum(set_lst, [])

    df = pd.DataFrame({
        "indices": helper,
        "distances": set_lst
    })

    if operation == "union":
        # imgs = list(set.union(*df["indices"]))
        # print(len(df))
        df = df.drop_duplicates(subset="indices")
        # print(len(df))

        df = df.sort_values("distances")
        print(df)
        return df["indices"].values
    if operation == "intersection":
        # inter = list(set.intersection(*helper2))
        # print(inter)
        df = df[df["indices"].isin(list(set.intersection(*helper2)))]
        df = df.drop_duplicates(subset="indices")
        df = df.sort_values("distances")
        # print(df)
        return df["indices"].values


def get_relevant_images_norank(img_lst, img_map, indices, k, operation="union"):
    """ Returns an intersection or union of similar images to a given list of images without a ranking
    """
    set_lst = []
    for img in img_lst:
        set_lst.append(set(get_similar_imgs(img, img_map, indices, k)))
    if operation == "union":
        return random.shuffle(list(set.union(*set_lst)))
    if operation == "intersection":
        return random.shuffle(list(set.intersection(*set_lst)))


def display_img(img_dir, img):
    """ Displays an image
    """
    display(Image(img_dir + img))


def display_imgs(img_dir, img_list):
    """ Displays images from the list
    """
    for img in img_list:
        display_img(img_dir, img)


def sample(img_list, sample_size):
    """ Returns image sample 
    """
    return random.sample(set(img_list), sample_size)


if __name__ == '__main__':
    pass
