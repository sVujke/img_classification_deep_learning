
# coding: utf-8

# In[1]:


import pandas as pd 
import numpy as np
from sklearn.neighbors import NearestNeighbors
import time 
import sys 
import gc

def load_data_np(features_path):
	""" Loads pickled data into a np array, sorted by images ascending, returns np array of vectors and a np array of images (sorted)
	"""
	print("Loading data..\n\n")

	data = pd.read_pickle(features_path)

	data = data.head(1000)

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

def get_distances_indicies(data, distance_metric, n_neighbors, n_cores):
	""" Fits the KNN based on choasen distance parameters and number of neighbors 
		returns  top n closest distances and indicies for each image 
	"""
	print("Finding KNN..\n\n")
	nbrs = NearestNeighbors(n_neighbors=n_neighbors, algorithm='auto', metric=distance_metric, n_jobs=n_cores).fit(data)
	
	return nbrs.kneighbors(data)

def get_img_map(img_names):
    """ Maps ordererd integer values to image names, example img  2 > 000002.jpg, 45 > 000045.jpg
    """
    img_map = {}
    for i in range(0,len(img_names)):
        img_map[i] = img_names[i]
    return img_map

def transform(nested_array, img_map):
    """ Transforms nested array values from  2 > 000002.jpg, 45 > 000045.jpg
    """
    squarer = lambda t: img_map[t]
    vfunc = np.vectorize(squarer, otypes=[np.str])
    return np.array([vfunc(i) for i in nested_array])

def main():

	start = time.time()

	features_path = sys.argv[1]
	output_dir = sys.argv[2]
	distance_metric = sys.argv[3] # eucledian, manhattan, cosine 
	n_neighbors = int(sys.argv[4])
	 

	if len(sys.argv) < 6:
		#by default we will go with 4 cores 
		n_cores = 4
	else:
		n_cores = int(sys.argv[5])

	data, img_lst = load_data_np(features_path)

	img_map = get_img_map(img_lst)

	distances, indices = get_distances_indicies(data, distance_metric, n_neighbors, n_cores)

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