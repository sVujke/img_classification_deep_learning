import random, string, base64, math


def ci_lower_bound(positive, total, confidence=0.95):
    """

    :param positive: number of positive votes
    :param total: total number of votes
    :param confidence: confidence interval
    :return:
    """
    #http://www.evanmiller.org/how-not-to-sort-by-average-rating.html

    if total == 0 or positive > total:
        return 0

    if positive == 0:
        return -1.0*total

    z = 1.96  #Statistics2.pnormaldist(1-(1-confidence)/2)
    phat = 1.0*positive/total
    return (phat + z*z/(2*total) - z * math.sqrt((phat*(1-phat)+z*z/(4*total))/total))/(1+z*z/total)


def random_md5like_hash():
    available_chars= string.hexdigits[:16]
    return ''.join(
        random.choice(available_chars)
        for dummy in xrange(32))


def image_from_base64str(b64str, path):
    """

    :param b64str:
    :param path: path to folder in which the image file will be renerated
    :return: path to image file
    """
    img = b64str.split(";base64,")[-1]
    img_format = b64str.split("data:image/")[-1].split(";")[0]
    path_to_image_file = path + random_md5like_hash() + '.' + img_format
    image_result = open(path_to_image_file, 'wb')
    image_result.write(base64.b64decode(img))
    image_result.close()
    return path_to_image_file
