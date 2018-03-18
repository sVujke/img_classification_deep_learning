from annoy import AnnoyIndex
import pandas as pd 
import numpy as np
import os 
from os.path import join
import gc
import sys 

path="../data/annoy_test/index.ann"
path_load = "../data/annoy_test/index.ann"


# In[3]:


def load_data_np(features_path):
	""" Loads pickled data into a np array, sorted by images ascending, returns np array of vectors and a np array of images (sorted)
	"""
	print("Loading data..\n\n")

	data = pd.read_pickle(features_path)

	# data = data.head(1000)

	data = data.sort_values("img")

	img_lst = data["img"].values

	if "transfer layer" in data.columns:
		data = np.array(data["transfer layer"].values)
	elif "output layer" in data.columns:
		data = np.array(data["output layer"].values)


	data = [np.array(row) for row in data]

	print("LOADED\n")

	n = gc.collect()

	return data, img_lst

def build_Index(data, vector_size, metric="euclidean",trees=10):
    """ Returns Annoy index for specified data, with specified number of trees
    """
    t = AnnoyIndex(vector_size, metric=metric)  # Length of item vector that will be indexed
    for count, v in enumerate(data): # 37k
        t.add_item(count, v)
    print(t)
    t.build(trees)
    print(t)
    print("Indexs has been built!\n\n")
    return t

def save_index(t, path):
    """ Saves index on specified path
    """
    t.save(path)
    
    print("Index saved at {}".format(path))

def load_index(path, vector_size=2048):
    """ Loads index from specified file and returnes it 
    """
    t = AnnoyIndex(vector_size)
    t.load(path)
    return t

def main():

    sys.path.append('../output_layer/inception.py')

    data, img_lst = load_data_np("../data/transfer_layer")

    t = build_Index(data, len(data[0]))

    save_index(t,path)

    n = gc.collect()

    t = load_index(path_load)

    x = t.get_nns_by_vector(data[0], n=50)

    print(x)

if __name__ == '__main__':
    main()