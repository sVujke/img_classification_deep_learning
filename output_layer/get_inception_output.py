
# coding: utf-8

import tensorflow as tf
import inception
from os import listdir
from os.path import isfile, join
from tqdm import tqdm
import pandas as pd
import sys


# # Paths
# img_dir = "../all_imgs/"


# # Load a list of images
def get_file_list(dir_path):
    """ Returns all files fron specified directory
    """
    onlyfiles = [f for f in listdir(dir_path) if isfile(join(dir_path, f))]
    return onlyfiles

# # Save output in file

def write_output_to_pickle(image_lst, img_dir, model,save_path="output_inception", k=5, only_first_name=False):
    """ Saves inception predictions with top 5 classes as a pickle file
    """
    imgs = image_lst
    output_layer = []
    top_k = []
    
    # Looping over images
    
    for img in tqdm(imgs):
        pred = model.classify(image_path=join(img_dir, img))
        output_layer.append(list(pred))
        scores = model.get_scores(pred=pred, k=k, only_first_name=only_first_name)
        top_k.append(scores)
        
    # Building a dataframe with columns for image names, prediction array, scores
    
    df = pd.DataFrame({
        "img": imgs,
        "output layer": output_layer,
        "scores": top_k
    })
    
    # saving to pickle
    
    df.to_pickle(save_path)


def main():
    # command line arguments
    img_dir = sys.argv[1]
    save_path = sys.argv[2]

    # geting list of images from specified dir
    imgs = get_file_list(img_dir)

    print("Number of images: ", len(imgs))

    # loading Inception
    inception.maybe_download()
    # creating an Inception instance
    model = inception.Inception()

    write_output_to_pickle(imgs, img_dir, model, save_path=save_path)

    model.close()

if __name__ == '__main__':
    main()


