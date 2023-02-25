---
layout: layouts/post.njk
title: Dockerfiles
description: This is an introduction to Dockerfiles
date: 2023-02-02
author: Morgan Walsh
categories:
  - Tutorial
  - DevOps
tags:
  - Docker
---

# Dockerfiles
  
As discussed in [Docker images](/notes/docker/docker_images.html), an image can be created from a Dockerfile. This allows images to have layers built upon them, each layer being some command in the `Dockerfile`.

## Dockerfile gubbins

A Dockerfile contains a variety of commands, here are some of them:

- `FROM <BASE_IMAGE>`: Specifies the base image to build on top of
- `EXPOSE <PORT>`: Specifies a port to be exposed by the container
- `COPY <HOST_PATH> <CONTAINER_PATH>`: Copies the specified content from the host into the container
- `WORKDIR <DIRECTORY>`: Sets the current working directory in the container, akin to doing `cd <DIR>`
- `CMD [<FRAGMENT>, <FRAGMENT>, ...]`: Runs the specified command when a container is created from the built image

## Dockerising a JAR file

In this example, we will dockerise a Spring Boot web server which serves a static website. Let's first create a directory 
for the project and download the JAR file:

```sh
mkdir dockerised_jar
cd dockerised_jar/
wget https://github.com/MrWalshyType2/SeleniumShoppingTestSite/releases/download/v1.0.0/test_shopping_site.jar
touch Dockerfile
```

Open the `Dockerfile` and enter the following:

```
# Base image of Java version 17
FROM openjdk:17
# Expose port app is served on in the container
EXPOSE 3000
# Copy JAR into container (COPY HOST_PATH CONTAINER_PATH)
COPY . /usr/src/app
# Set the working directory in the container
WORKDIR /usr/src/app
# Run the JAR file
CMD ["java", "-jar", "test_shopping_site.jar"]
```

Now that we have a `Dockerfile`, we can build an image:
  
```sh
docker build -t shopping_site .
```

We can then create a container from the built image:
  
```sh
docker run -dp 8080:3000 --name my_website shopping_site
```

Now, open `localhost:8080` in your browser to open the website served by the Dockerised Java application. If all went well, you should see the following in your browser:

![image](https://user-images.githubusercontent.com/29315632/216304156-4720fb84-3fa3-401e-b595-a516684129ba.png)
  
We can then clean up once we are done:

```sh
docker stop my_website
docker rm my_website
```

We can then remove the image if we no longer need it as well:

```sh
docker rmi shopping_site
```
