from annoy import AnnoyIndex
import pandas as pd
import numpy as np
import gc
import sys
import inception


# In[3]:


def load_data_np(features_path):
    """ Loads pickled data into a np array, sorted by images ascending,
     returns np array of vectors and a np array of images (sorted)
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


def build_Index(data, vector_size, metric="euclidean", trees=10):
    """ Returns Annoy index for specified data, with specified number of trees
    """
    t = AnnoyIndex(
        vector_size, metric=metric)  # Length of item vector that will be indexed
    for count, v in enumerate(data):  # 37k
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


def get_tl_vector(inception_obj, img_path):
    return inception_obj.transfer_values(img_path)


def get_ol_vector(inception_obj, img_path):
    return inception_obj.classify(img_path)


def main():

    img_path = sys.argv[1]

    data, img_lst = load_data_np("../data/transfer_layer")

    t = build_Index(data, len(data[0]))

    save_index(t, path)

    n = gc.collect()

    inception.maybe_download()

    incept = inception.Inception()

    vector = get_tl_vector(incept, img_path)

    x = t.get_nns_by_vector(vector, n=50)

    print(x)


if __name__ == '__main__':
    main()
