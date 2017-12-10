
# coding: utf-8

# In[38]:

import pandas as pd 
import numpy as np
import os
from IPython.display import Image, display
from sklearn.cluster import KMeans
from yellowbrick.cluster import KElbowVisualizer
from yellowbrick.cluster import SilhouetteVisualizer
from random import randint


# In[2]:

def make_flat_lst(lst):
    """ Makes 2D list into 1D list
    """
    lst = list(lst)
    return [x[0] for x in lst]


# In[3]:

def random_element(lst):
    """ Returns random list element
    """
    return lst[randint(0,len(lst)-1)]


# In[4]:

path = "fc8/"
files = os.listdir(path)


# In[5]:

def load_files(path, num = 'all'): 
    """ Returns DataFrame with features after loading each feature file
    """
    files = os.listdir(path)
    lst = []
    if num == 'all':
        f_list = files
    if type(num) is int:
        f_list = files[:num]
    f_list
    for f in f_list:
        f_path = path+"/"+f
        row = make_flat_lst(pd.read_csv(f_path, header = None).values)
        lst.append(row)
    return pd.DataFrame(lst)

def load_images(path="C:\Users\Latitude E7450\Documents\dev\lab"):
    """ Returns list of images on specified path
    """
    imgs = os.listdir(path)
    imgs = [x for x in imgs if x.endswith(".jpg")]
    return imgs 

# imgs = load_images()
# for i in range(40,60):
#     print(i)
#     print(imgs[i])
#     display(Image(imgs[i]))

# kmeans = KMeans(n_clusters=20, random_state=0).fit(df)

# df_clust = df
# df_clust['class'] = kmeans.labels_


def rand_img_from_cluster(df,n):
    """ Returns random image from specified cluster
    """
    clust_x = df[df["class"] == n]
    c_imgs = [x.replace("txt", "jpg") for x in list(clust_x.index.values)]
    return random_element(c_imgs)


def return_from_cluster(df,n,num="all"):
    """ Returns list of images from cluster
    """
    clust_x = df[df["class"] == n]
    c_imgs = [x.replace("txt", "jpg") for x in list(clust_x.index.values)]
    if num == 'all':
        return c_imgs
    else:
        return c_imgs[num]


# for i in range(0,20):
#     print("Cluster "+str(i+1))
#     img1 = rand_img_from_cluster(df, i)
#     loop=True
#     while(loop):
#         if rand_img_from_cluster(df, i) != img1:
#             img2 = rand_img_from_cluster(df, i)
#             loop=False
#     loop = True
#     while(loop):
#         if rand_img_from_cluster(df, i) != img1:
#             img3 = rand_img_from_cluster(df, i)
#             loop=False
#     display(Image(img1))
#     display(Image(img2))
#     display(Image(img3))

if __name__ == '__main__':
    main()



