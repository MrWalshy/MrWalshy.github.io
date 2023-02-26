---
layout: layouts/post.njk
title: Docker Bind Mounting
thumbnail: /assets/images/devops/docker-whale.png
description: This is a tutorial on Bind Mounting in Docker
date: 2023-02-01
author: Morgan Walsh
categories:
  - Tutorial
  - DevOps
tags:
  - Docker
---

## Allowing Docker access to the file system with a Bind Mount

Docker is capable of sharing the hosts file system, and the networking stack, with containers. This is useful as the data a container needs
might not reside in the image your container is created from.

In this example, we create a **Nginx** server to serve a website from the hosts file system. We do this by attaching a **volume**
to the container when we start it. Let's create a location on the Docker host to contain our site:

```sh
sudo mkdir /srv/www
echo "<h1>Hello world</h1>" > /srv/www/index.html
sudo chmod -R 755 /srv/www
```

> `/srv` is the directory recommended by the [Unix File System Hierarchy spec](https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/srv.html).

## Running a container with a volume

The `docker run` command is useful for quickly starting a container from a given image, we can use the `-v`/`--volume`
flag to pass a volume to the container. A **volume** being a mechanism for persisting data generated and used by Docker containers, they 
are managed by Docker itself. Volumes can also be shared across multiple containers if needed.

When passing the `-v` flag to `docker run`, there is a specific format expected:

```sh
docker run -v HOST_MOUNT_PATH:CONTAINER_MOUNT_PATH
```

When a single argument is passed to `-v`, like `-v /srv/www`, it allocates space and mounts the volume at the specified 
location in the container.

When given two arguments, the directory on the host is mounted inside the container at the specified container path. This will 
expose any files on the host in the given directory to the container:

```sh
docker run -v /srv/www:/usr/share/nginx/html -p 8080:80 -d nginx
```

To ensure the container runs in the background, the `-d` flag for detaching a container was passed to `docker run`. The `-p` 
flag was used to expose port `80` in the container to `8080` on the host system, allowing you to run `curl localhost:8080` 
to query for the `index.html` file created earlier:

```sh
morgan@morgan-server:~$ curl localhost:8080
<h1>Hello world</h1>
```

If we run `docker ps`, we will see that port `8080` on the host is being forwarded to port `80` on the container:

```sh
morgan@morgan-server:~$ docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                                   NAMES
ecec582a24f3   nginx     "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp, :::8080->80/tcp   beautiful_mendeleev
```

We can then stop and delete our container if it is no longer needed, and the resources on the host shared as a volume 
will remain where they are:

```sh
morgan@morgan-server:~$ docker stop beautiful_mendeleev
beautiful_mendeleev
morgan@morgan-server:~$ docker rm beautiful_mendeleev
beautiful_mendeleev
```

If we type `docker volume ls`, we will not have any volumes present. This is because the volume created before was a 
**bind mount**, this is an ephemeral volume which only exists while the container is bound to the directory 
on the host system; it is never given a name by default. When bind mounting, it is important to always specify an absolute path for the host machines directory 
that is being mounted in the container; if the file or directory does not exist on the host, it will be created automatically 
by Docker.