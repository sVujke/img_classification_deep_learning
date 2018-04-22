# Deep Learning Research Lab

This repository is a result of the Deep Learning Research Lab at the [University of Koblenz-Landau](https://www.uni-koblenz-landau.de/en), Germany. The project was carried out by a team of master students, attending Web Science or Mathematical Modelling, with the goal of learning about Deep Learning methods through collaboration.

## The Problem

The goal of our project was to develop an image retrieval system by using Deep Learning, Machine Learning and other compatible methods. The search engine in question needs to be able to retrieve corresponding images for the searched keyword. We assume that:
* The user is searching for an object in the represented in the image.
* The search engine has the functionality of learning new queries through user feedback on returned results or through an inverse image query. 
* The user feedback is also taken into account for ranking the results.
* The search engine will not have any given metadata describing the content of the images. 
* The search engine should be able to support further extending of the image dataset. 
* Images need to be ranked based on relevance that the users have expressed through giving feedback
* We were given a set of unlabeled X images, a machine with 16 GB RAM and a 8 core CPU. 


## Approach

For the frontend the ReactJS framework is used.

## Software and Hardware

## Examples of use

### Retrieval Scenario - When the query term is known

[![IMAGE ALT TEXT HERE](https://www.youtube.com/yt/about/media/images/brand-resources/icons/YouTube-icon-our_icon.png)](https://www.youtube.com/watch?v=llYrKU2tgbs&index=1&list=PLRNgM8Xk6PKbFOFw0H5OG_injSrKnher4)

### Retrieval Scenario - When the query term is known

[![IMAGE ALT TEXT HERE](https://www.youtube.com/yt/about/media/images/brand-resources/icons/YouTube-icon-our_icon.png)](https://www.youtube.com/watch?v=hqq2XkGp4Rc&list=PLRNgM8Xk6PKbFOFw0H5OG_injSrKnher4&index=4)

### Retrieval Scenario - The reverse image query

[![IMAGE ALT TEXT HERE](https://www.youtube.com/yt/about/media/images/brand-resources/icons/YouTube-icon-our_icon.png)](https://www.youtube.com/watch?v=pOYEjNEySpU&index=3&list=PLRNgM8Xk6PKbFOFw0H5OG_injSrKnher4)

## Results

## Tech details

To run the React app:
1. navigate to the "frontend" folder and run "$ npm install".
2. After the node_modules are installed, run "$ npm start".
3. To build the production version, run "$ npm build".

### Scripts

### get_inception_output.py 

How to run: 

```{r, engine='bash', count_lines}
python get_inception_output.py [image_path] [output_path] 
```
Script saves a file with vectors from the output layer, for each image on **inage_path** and saves it as pickle on **output_path**. 

### get_transfer_layer.py 

How to run: 

```{r, engine='bash', count_lines}
python get_transfer_layer.py [image_path] [output_path] 
```
Script saves a file with vectors from the transfer layer, for each image on **inage_path** and saves it as pickle on **output_path**. 

### compute_distances.py 

How to run: 

```{r, engine='bash', count_lines}
python compute_distances.py [features_path] [output_dir_path] [distance_metric] [n_neighbors] [n_cores]
```

Scripts uses vectors from output layer of the CNN for each image in the file specified with **features_path** to find top **n_neighbors** with the specified **distance_metric**. The neighbors and distances are stored in two separate files in the **output_dir_path**
This script copies fiels from **path_copy** to **path_paste**. The files are specified in the **filter.csv** file. An optional parameter is the parameters for the **n_cores** to be used, value -1 means all cores are to be used, by default the value is 4. 

