from os import path
from django.conf import settings

def path_to_root():
    return path.dirname(path.abspath(__file__)).split('dlsite')[0]


def path_to_static():
    return path_to_root() + settings.STATIC_URL


def path_to_images_folder_absolute():
    return path_to_root() + 'frontend' + '/' + 'public' + '/' + path_to_images_folder_frontend()


def path_to_image_absolute(image_name):
    return path_to_root() + 'frontend' + '/' + 'public' + '/' + path_to_image_frontend(image_name)


def path_to_images_folder_frontend():
    return 'mlimages' + "/"


def path_to_image_frontend(image_name):
    return path_to_images_folder_frontend() + image_name


def image_name_from_path(path_to_image):
    return path_to_image.split("/")[-1]

