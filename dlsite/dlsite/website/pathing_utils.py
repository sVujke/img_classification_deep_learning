from os import path, makedirs
import errno
from django.conf import settings


def __mkdir_p(p):
    try:
        makedirs(p)
    except OSError as exc:  # Python >2.5
        if exc.errno == errno.EEXIST and path.isdir(p):
            pass
        else:
            raise


def path_to_root():
    return path.dirname(path.abspath(__file__)).split('dlsite')[0]


def path_to_static():
    return path_to_root() + 'dlsite' + path.sep + 'dlsite' + path.sep + 'website' + settings.STATIC_URL


def path_to_uploads(query):
    p = path_to_root() + 'dlsite' + path.sep + 'dlsite' + path.sep + 'website' + settings.STATIC_URL + 'uploads' + \
           path.sep + query + path.sep
    __mkdir_p(p)
    return p


def path_to_images_folder_absolute():
    return path_to_root() + 'frontend' + path.sep + 'public' + path.sep + path_to_images_folder_frontend()


def path_to_image_absolute(image_name):
    return path_to_root() + 'frontend' + path.sep + 'public' + path.sep + path_to_image_frontend(image_name)


def path_to_images_folder_frontend():
    return 'mlimages' + path.sep


def path_to_image_frontend(image_name):
    return path_to_images_folder_frontend() + image_name


def image_name_from_path(path_to_image):
    # print("THIS IS IT:",path_to_image)
    return path_to_image.split(path.sep)[-1]

