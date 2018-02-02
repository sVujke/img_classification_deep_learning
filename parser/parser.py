
# coding: utf-8

# In[1]:

import pandas as pd
import sys


# In[2]:


# # Remove redundant starting lines

def trim_lines(df, x=5):
    """ Removes first {x} rows from dataframe and the last row.
    """
    df = df.iloc[x:-1]
    return df

# df = trim_lines(df)

# ### Adding column name

# df.columns = ["original"]


# # Removing evaluation


def label_evaluation(x):
    """ Needed for apply function
    """
    if "evaluating performance... " in x:
        return "yes"
    else:
        return "no"

def filter_evaluation(df):
    """ Filters evaluation lines
    """
    # label
    df["eval"] = df.original.apply(lambda x: label_evaluation(x))
    # filter
    df = df[df["eval"] == "no"]
    df = df.drop(["eval"], axis=1)
    return df

# df = filter_evaluation(df)

# df.head()


# # Extracting patahs, img names and caption

def extract_data(df):
    """ Extracts two columns for paths where images are located, image names, and caption for each image
    """
    paths = list(df.iloc[::2, :].values)
    paths = [path[0] for path in paths]
    images = list(df.iloc[1:].iloc[::2, :].values)
    images = [img[0] for img in images]
    
    df = pd.DataFrame({
    "paths": paths,
    "images": images
    })
    
    df["caption"] = df.images.apply(lambda x: x.split(": ")[1].replace("\t",""))
    df["path1"] = df.paths.apply(lambda x: x.split(" ")[1])
    df["path2"] = df.paths.apply(lambda x: x.split(" ")[2])
    df["name1"] = df.path1.apply(lambda x: x.split("/")[-1].strip('"'))
    df["name2"] = df.path2.apply(lambda x: x.split("/")[-1].strip('\t"'))
    
    return df


# df = extract_data(df)

def save(df, save_path):
    df.to_csv(save_path, encoding="utf-8", index=False)
    print("File saved at: ", save_path)


# save(df, path_save)

if __name__ == '__main__':
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]

    # # Read TXT File

    df = pd.read_csv(input_path)
    print(input_path, "LOADED!")

    df = trim_lines(df)

    df.columns = ["original"]

    df = filter_evaluation(df)

    df = extract_data(df)

    save(df, output_path)