# Deep Learning Research Lab

This repository is a result of the Deep Learning Research Lab at the [University of Koblenz-Landau](https://www.uni-koblenz-landau.de/en), Germany. The project was carried out by a team of master students, attending Web Science or Mathematical Modelling, with the goal of learning about Deep Learning methods through collaboration.

## The Problem

## Approach

For the frontend the ReactJS framework is used.

## Software and Hardware

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

