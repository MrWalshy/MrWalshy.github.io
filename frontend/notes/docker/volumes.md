@docArgs()
```
"title": "Docker Images (basics) | morganwalsh.dev", 
"links": ["/style.css"],
"scripts": ["/scripts/common.js"],
"date": "01/02/2023"
```

<div class="p-16 w-80 w-md-100 ml-auto mr-auto">
  
# Docker volumes
  
## Overview
  
By default, a Docker container is isolated when it runs; any data changed within the read-write layer during the containers runtime is lost
after the container stops or is deleted. Volumes can be used to persist data, even if a container stops; they can also be attached 
to other containers if wanted.
  
```
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
|	 -----------------------             -----------------------           |
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
  
```
docker volume create my_volume
```
  
If the volume name is omitted, a random name will be generated and assigned to the volume.
  
### Listing volumes
  
Use the `docker volume ls` command to list out any local Docker volumes that your Docker host is aware of:
  
```
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
  
```
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
  
</div>
