import pickle
# import pandas as pd
import sys


def pickle_load(path_load, protocol=4):
    with open(path_load, 'rb') as f:
        obj = pickle.load(f)
    print("Pickle loaded!")
    return obj


def pickle_save(obj, save_path, protocol=2):
    with open(save_path, 'wb') as f:
        pickle.dump(obj, f, protocol=protocol)
    print("Pickle saved at: {}".format(save_path))


def main():
    path_load = sys.argv[1]
    protocol_load = int(sys.argv[2])
    path_save = sys.argv[3]
    protocol_save = int(sys.argv[4])

    pickle_save(pickle_load(path_load, protocol=protocol_load),
                path_save, protocol=protocol_save)


if __name__ == '__main__':
    main()
