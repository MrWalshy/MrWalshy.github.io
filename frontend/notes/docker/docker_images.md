@docArgs()
```
"title": "Docker Images (basics) | morganwalsh.dev", 
"links": ["/style.css"],
"scripts": ["/scripts/common.js"],
"date": "01/02/2023"
```

<div class="p-16 w-80 w-md-100 ml-auto mr-auto">

# Docker images

A Docker container is an instance of a Docker image that may be in the `Up` or `Exited` status, the main difference between 
a container and an image is that the container has a writable layer. Images are built-up of reusable layers which 
make them more efficient and performant with system resources:

```
 -----------------------
|        LAYER 3        |
 -----------------------
|        LAYER 2        |
 -----------------------
|        LAYER 1        |
 -----------------------
```

Each layer of the image builds upon the previous layer, adding more to it; this could be a configuration, a set of applications, etc... We can build 
images completely from scratch when creating our own, but the preferred route is to use a base image to build ours on top of:

```
 -----------------------
|    CUSTOM_LAYER 3     |
 -----------------------
|    CUSTOM_LAYER 2     |
 -----------------------
|    CUSTOM_LAYER 1     |
 -----------------------
           ^
           |
 -----------------------
|      BASE_IMAGE       |
 -----------------------
```

We create our custom image using a special file called a `Dockerfile`, this specifies the base image and additional 
layers.

## Creating an Nginx image from a `Dockerfile`

First, create a directory and a file called `Dockerfile` inside of it:

```sh
mkdir ~/nginx-image
mkdir ~/nginx-image/site
touch ~/nginx-image/Dockerfile
echo "<h1>Hello world</h1>" > ~/nginx-image/site/index.html
```

Open the `Dockerfile` and enter the following:

```
FROM nginx
COPY ./site /usr/share/nginx/html
```

The first instruction, `FROM` indicates what the base image we are creating our own from is. It is required by all 
Dockerfiles. The following instructions are then layers added to the base image. In this case, the second instruction is 
`COPY` which copies the specified file into a destination:

```
FROM <BASE_IMAGE>
COPY HOST_SOURCE CONTAINER_DESTINATION
```

### Building the image

Currently, we have a `Dockerfile` but no image. We will use the `docker build` command to build an image from a 
`Dockerfile`. Our custom images layers will look like:

```
 -----------------------
|       COPY ...        |
 -----------------------
           ^
           |
 -----------------------
|        NGINX          |
 -----------------------
```

Let's change into the directory where our `Dockerfile` is and build it to an image locally:

```sh
cd ~/nginx-image
docker build -t custom_nginx .
```
  
The `-t` flag indicates we want to tag the image with the name `custom_nginx`, as we don't specify a release it defaults to 
`custom_nginx:latest`. The `.` indicates to look in the current directory for the `Dockerfile`:
  
```sh
morgan@morgan-server:~/nginx-image$ docker build -t custom_nginx .
Sending build context to Docker daemon  3.584kB
Step 1/2 : FROM nginx
 ---> a99a39d070bf
Step 2/2 : COPY ./site /usr/share/nginx/html
 ---> 9b517cdb308d
Successfully built 9b517cdb308d
Successfully tagged custom_nginx:latest

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
```

The output show Docker pulling the `nginx` image and then applying the custom `COPY` step. If we run the `docker images` 
command, or `docker image ls`, we will see the `custom_nginx` image we created and the `nginx` image that was pulled down:

```sh
REPOSITORY                 TAG       IMAGE ID       CREATED         SIZE
custom_nginx               latest    9b517cdb308d   2 minutes ago   142MB
nginx                      latest    a99a39d070bf   3 weeks ago     142MB
```

We can then run this local image with `docker run`:

```sh
docker run --name nginxy_container -dp 8080:80 custom_nginx
```

Running `docker ps` will reveal our running container with the image built using our `Dockerfile`:

```sh
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                                   NAMES
9cb30038b9c0   custom_nginx   "/docker-entrypoint.…"   2 seconds ago   Up 2 seconds   0.0.0.0:8080->80/tcp, :::8080->80/tcp   nginxy_container
```

We can then `curl localhost:8080` to query the nginx web server, which should return the HTML we placed in the 
`index.html` file earlier:

```sh
<h1>Hello world</h1>
```

Now that we have verified this, lets stop and remove the container:

```sh
morgan@morgan-server:~/nginx-image$ docker stop nginxy_container
dnginxy_container
morgan@morgan-server:~/nginx-image$ docker rm nginxy_container
nginxy_container
```

## Deleting an image

To delete an image, list the available images with `docker images`:

```sh
REPOSITORY                 TAG       IMAGE ID       CREATED          SIZE
custom_nginx               latest    9b517cdb308d   10 minutes ago   142MB
nginx                      latest    a99a39d070bf   3 weeks ago      142MB
```
  
Then use `docker rmi` or `docker image rm` to remove specified images:

```sh
docker rmi custom_nginx:latest nginx:latest
```
  
Running `docker images` again will verify the image was deleted:

```sh
REPOSITORY                 TAG       IMAGE ID       CREATED         SIZE
```

> Did you get an error when trying to remove the image? If you did, it is likely that your image is being used by a 
> container. Stop and delete the container(s) using the image first.

</div>
