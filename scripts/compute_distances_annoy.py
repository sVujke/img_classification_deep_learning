import pandas as pd 
import numpy as np
from annoy import AnnoyIndex
from compute_distances import load_data_np, get_img_map, transform
import time 
import sys 
import gc

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


def nhood_query(item_index,annoy_index, nn=51):
    """ Returns list of tuple pairs neighbors and distances of specified items
    """
    neighbors = annoy_index.get_nns_by_item(item_index, nn, include_distances=True)
    return neighbors[0], neighbors[1]

def get_indices_distances(data, metric="euclidean", nn=51, trees=20):
    """ Returns nested np array of indicies and distances 
    """
    indices_lst = []
    distances_lst = []
    t = build_Index(data, len(data[0]), metric=metric,trees=trees)
    for count, v in enumerate(data): # 37k
        indices, distances = nhood_query(count, t, nn=nn)
        indices_lst.append(np.array(indices))
        distances_lst.append(np.array(distances))
    return np.array(indices_lst), np.array(distances_lst)

def main():
	start = time.time()

	features_path = sys.argv[1]
	output_dir = sys.argv[2]
	distance_metric = sys.argv[3] # eucledian, manhattan, cosine 
	n_neighbors = int(sys.argv[4])
	n_trees = int(sys.argv[5])


	data, img_lst = load_data_np(features_path)

	img_map = get_img_map(img_lst)

	distances, indices = get_distances_indicies(data, metric=distance_metric, nn=n_neighbors, trees=n_trees)

	np.savetxt("{}/distances_{}.csv".format(output_dir,distance_metric), distances, delimiter=",")

	print("Distances saved to CSV file")

	indices = transform(indices, img_map)

	print(indices[0])

	np.savetxt("{}/indices_{}.csv".format(output_dir,distance_metric), indices, fmt='%s', delimiter=",")

	print("Indices saved to CSV file")

	end = time.time()

	duration = end-start

	if duration > 60:
		print("Time used: {} {}".format(duration/60, "minutes"))
	if duration > 3600:
		print("Time used: {} {}".format(duration/3600, "hours"))
	else:
		print("Time used: {} {}".format(duration, "seconds"))

if __name__ == '__main__':
	main()