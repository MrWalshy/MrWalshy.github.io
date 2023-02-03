@docArgs()
```
"title": "Docker volumes (basics) | morganwalsh.dev", 
"links": ["/style.css"],
"scripts": ["/scripts/common.js"],
"date": "03/02/2023"
```

<div class="p-16 w-80 w-md-100 ml-auto mr-auto">
  
# Docker volumes
  
## Overview
  
By default, a Docker container is isolated when it runs; any data changed within the read-write layer during the containers runtime is lost
after the container stops or is deleted. Volumes can be used to persist data, even if a container stops; they can also be attached 
to other containers if wanted.
  
```sh
                         -----------------------             
                        |        VOLUME         |           
                         ----------------------- 
                                   ^
                                   |
                                   ∨
 ------------------------------------------------------------------------
|                                 CONTAINER                              |
|	 -----------------------             -----------------------           |
|	|   READ/WRITE LAYER    |   <----   | Container layer (RW)  |          |
|  -----------------------             -----------------------           |
|  -----------------------             -----------------------           |
|	|    CUSTOM_LAYER 3     |           |                       |          |
|  -----------------------            |                       |          |
|	|    CUSTOM_LAYER 2     |           |                       |          |
|  -----------------------    <----   |                       |          |
|	|    CUSTOM_LAYER 1     |           |     Image layer       |          |
|  -----------------------            |     (READ ONLY)       |          |
|        	   ^                        |                       |          |
|        	   |                        |                       |          |
|  -----------------------            |                       |          |
|	|      BASE_IMAGE       |           |                       |          |
|	 -----------------------             -----------------------           |
 ------------------------------------------------------------------------
```
  
As demonstrated in the above diagram, a volume is external to the container.
  
> A volume differs from a bind mount, although a bind mount can be mounted using the `--volume` flag to `docker run`. Volumes basically represent 
> a hard drive that can be plugged into some container(s) (they are Docker native), and then mounted on a specific path. A bind mount allows direct 
> communication with the hosts file system instead.
  
## Volume management
  
Docker exposes the `docker volume` command for managing volumes, this can be used for creating, reading, updating and deleting volumes.
  
### Creating a volume
  
To create a volume, use `docker volume create <VOLUME_NAME>`:
  
```sh
docker volume create my_volume
```
  
If the volume name is omitted, a random name will be generated and assigned to the volume.
  
### Listing volumes
  
Use the `docker volume ls` command to list out any local Docker volumes that your Docker host is aware of:
  
```sh
morgan@morgan-server:~$ docker volume ls
DRIVER    VOLUME NAME
local     my_volume
```
  
As output, we get the `DRIVER` and `VOLUME NAME` of our volumes. The `DRIVER` states how and where the volume is stored, in this case 
locally. This tells the Docker host how to locate the volume.
  
If we only wanted to see `local` volumes, we could specify this using the `--filter`/`-f` flag:
  
```
docker volume ls --filter driver=local
```
  
### Inspecting a volume
  
The `docker volume inspect <VOLUME_NAME>` command allows us to display information about a volume, this includes data like:
  
- **CreatedAt**: When the volume was created
- **Driver**: How the volume is located
- **Mountpoint**: Where on the host the volume is stored
- **Name**: The unique name for the volume
  
```sh
morgan@morgan-server:~$ docker volume inspect my_volume
[
    {
        "CreatedAt": "2023-02-03T11:05:38Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/my_volume/_data",
        "Name": "my_volume",
        "Options": {},
        "Scope": "local"
    }
]
```
  
### Deleting volumes
  
A volume is deleted using the `docker volume rm <VOLUME_NAME>` command, this is a dangerous operation as it permanently 
deletes the data a volume holds:
  
```sh
docker volume rm my_volume
```
  
### Pruning volumes
  
The `docker volume prune` command is used to remove unused containers, that is it will remove all containers which are not in 
use by at least one container:
  
```sh
morgan@morgan-server:~$ docker volume prune
WARNING! This will remove all local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
my_volume

Total reclaimed space: 0B
```
  
As `my_volume` was empty, there was `0B` (0 Bytes) of memory reclaimed. This will differ dependant on your volumes size.
  
## Attaching a volume to a container
  
There are two main ways to attach a volume to a container when it is ran with `docker run`:
  
- Using the `-v`/`--volume` flag
- Using the `--mount` flag
  
### `--volume`
  
To mount a volume, we follow the format:
  
```sh
docker run -v VOLUME:MOUNT_POINT:OPTIONS
```
  
The `VOLUME` is the volumes name, this could also be a bind-mount directory if bind-mounting. The `MOUNT_POINT` is exactly that, 
where to mount the volume in the container. The `OPTIONS` are optional, and can be used to change the behaviour of the volume; `ro` would make the volume read-only for example.
  
Let's create a volume and attach it to a container:
  
```sh
docker volume create bash_volume
docker run -dit \
           --volume bash_volume:/var/opt/my_volume \
           --name my_bash \
           bash:latest bash
```
  
> If the specified volume does not exist, Docker will create it on the host for you
  
If we `docker ps`, we will see the running container:
  
```sh
CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS        PORTS     NAMES
8f173439748b   bash:latest   "docker-entrypoint.s…"   2 seconds ago   Up 1 second             my_bash
```
  
We will then attach to the container:
  
```sh
docker attach my_bash
```
  
If we list the contents of `/var/opt`, we will see the `my_volume` that we attached earlier:
  
```sh
bash-5.2# ls /var/opt/
my_volume
```
  
Let's add some content to the volume:
  
```sh
echo "Hello world" > /var/opt/my_volume/readme.txt
```
  
Now, let's stop and delete the container that the volume is attached to. The aim is to attach the volume to a new container to 
prove that the data persists between uses:
  
```sh
docker stop my_bash
docker rm my_bash
```
  
We can now launch a new container, this time we will just have it print the contents of the file created earlier to standard output:
  
```sh
docker run --volume bash_volume:/var/opt/my_volume \
           --name my_new_bash \
           bash:latest bash -c "cat /var/opt/my_volume/readme.txt"
```
  
This will output the contents of `readme.txt` stored on the volume called `my_volume`:
  
```sh
Hello world
```
  
### `--mount`
  
The `--mount` flag is a more verbose way of mounting a volume, it has the following format:
  
```sh
docker run --mount \
  'type=<TYPE>, \
   src=<SOURCE>, \
   dst=<DESTINATION>, \
   volume-driver=<DRIVER>, \
   <OPTIONS>'
```
     
The `--mount` flag accepts a comma-separated string of `key=value` pairs:
     
- `type`: The type of the volume being mounted
- `src`: The name of the volume, or directory if a bind mount
- `dst`: The mount point in the container for the volume
- `volume-driver`: Where the volume is located
- `options`: These include things like `readonly` and `rw` for read/write
  
We can print the contents of the file from the earlier example to demonstrate using `--mount`:
     
```sh
docker run --mount \ 
     'type=volume,\
     src=bash_volume,\
     dst=/var/opt/my_volume,\
     volume-driver=local' \
     bash -c "cat /var/opt/my_volume/readme.txt"
```
     
</div>
