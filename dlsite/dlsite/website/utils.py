import math


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