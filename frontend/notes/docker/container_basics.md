@docArgs()
```
"title": "Docker intro | morganwalsh.dev", 
"links": ["/style.css"],
"scripts": ["/scripts/common.js"],
"date": "31/01/2023"
```

<div class="p-16 w-80 w-md-100 ml-auto mr-auto">

# A Docker introduction

> These notes assume you have Docker installed. These notes where written using Docker version 20.10.23, build 7155243

Docker is a containerisation technology used to package applications as lightweight, portable container images. These images contain the application alongside the gubbins needed 
to make it work, gubbins includes things like the OS, networking, configurations, etc... A container is not a virtual machine though, they instead share a Linux kernel that the 
Docker host has access to; this makes containers use less resources, and thus be more efficient.

## Simple test

If you installed Docker following the instructions on the Docker website, you have likely done this step. We can quickly spin up a container with the command:

```sh
docker run hello-world
```

If all went well, Docker will not find an image on the local system. This will force Docker to search its registered registry, by default this is Docker Hub. If everything is setup correctly and you have a network connection, the image 
will be pulled down from Docker Hub and then run. The following will `Hello from Docker!` message will then show:

```sh
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

## Getting help

The `docker` command comes with help available, after any command pass the `--help` flag instead of its normal input to see the help information for that command.

## Viewing and re-attaching containers

The `docker ps` command is used to list running containers. If you have followed from the start, your terminal will output the following when you run the command:

```sh
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

> Another way of listing running containers is with `docker container ls`

It's quite empty... This is because we do not have any containers running, the `hello-world` container image from before was started, it executed its code and then shut down. If we use `docker ps -a` or `docker container ls -a`, we can see the `hello-world` container:

```sh
CONTAINER ID   IMAGE                     COMMAND                  CREATED         STATUS                      PORTS     NAMES
874ab39f8c8b   hello-world               "/hello"                 6 minutes ago   Exited (0) 6 minutes ago              optimistic_moore
```

> The `-a` flag to `docker ps` is the short-hand flag for the long-form `--all`.

Each column represents some data describing a container:

- **CONTAINER ID**: A unique identifier for the container
- **IMAGE**: The name of the image used for the container
- **COMMAND**: The command executed when the container was started
- **CREATED**: How long ago the container was created
- **STATUS**: Indicates the current status of the container
- **PORTS**: Ports the container exposes to its host system
- **NAMES**: A randomised name given to a container, names can also be set manually

The `hello-world` container has an `Exited` status, with an indicated time elapsed since it exited. In parenthesis is an exit code, `(0)` is indicating a clean exit without error. Try running `docker run hello-world` to run the `hello-world` image again, then run `docker ps -a` again. You should see that there are now multiple containers with the same image:

```sh
CONTAINER ID   IMAGE                     COMMAND                  CREATED          STATUS                      PORTS     NAMES
3750a4e5e134   hello-world               "/hello"                 3 seconds ago    Exited (0) 3 seconds ago              elegant_mcnulty
874ab39f8c8b   hello-world               "/hello"                 12 minutes ago   Exited (0) 12 minutes ago             optimistic_moore
```

This is because `docker run` will not reuse an existing container unless you specify the containers name or ID. We can reattach to a container then by using the `docker start` command and passing it the `--attach` flag with the name of a container, I use `elegant_mcnulty` like so in this example:

```sh
docker start --attach elegant_mcnulty
```

> `docker start` is just an alias for `docker container start`.

### Filtering results

We can filter the results returned by `docker ps` by passing the `--filter` flag, running `sudo docker ps -a --filter name=elegant_mcnulty` would return:

```sh
CONTAINER ID   IMAGE                     COMMAND                  CREATED          STATUS                      PORTS     NAMES
3750a4e5e134   hello-world               "/hello"                 3 seconds ago    Exited (0) 3 seconds ago              elegant_mcnulty
```

This is useful if you have lots of containers on your system. The command can filter by specifying what to filter on, we would pass `id=xxx` for filtering on a container ID or `port` for filtering on a specific port.

## Deleting containers

In the previous section, there was two containers left over from the `hello-world` image:

```sh
CONTAINER ID   IMAGE                     COMMAND                  CREATED          STATUS                          PORTS     NAMES
3750a4e5e134   hello-world               "/hello"                 5 minutes ago    Exited (0) About a minute ago             elegant_mcnulty
874ab39f8c8b   hello-world               "/hello"                 18 minutes ago   Exited (0) 18 minutes ago                 optimistic_moore
```

We will use the `docker rm <CONTAINER_NAME/ID>` command to remove them:

```sh
morgan@morgan-server:~$ docker rm elegant_mcnulty
elegant_mcnulty

morgan@morgan-server:~$ docker rm optimistic_moore
optimistic_moore

morgan@morgan-server:~$ docker ps -a
CONTAINER ID   IMAGE                     COMMAND                  CREATED        STATUS                      PORTS     NAMES
```

After deleting a container, its name will be echoed to standard out. Running `docker ps -a` after deleting the containers reveals they no longer exist.

> We can force the removal of a stubborn container by passing the `-f`/`--force` flag to `docker rm`.

## Interactive containers

The following example uses the command from the `hello-world` image output:

```sh
docker run -it ubuntu bash
```

> `docker run` is short for `docker container run`

The `docker run` command can run an image, specifically the command assigned to the image in a new container. We can also use it to connect to the terminal, in an interactive fashion. The `-i` flag is short for exactly that, `--interactive` while `-t` is short for `--tty`... This will *Allocate a pseudo-TTY* according to `docker run --help`, a `tty` being a **teletypewriter**... kind of. In this day and age, `tty` is used to refer to how Unix/Linux systems handle terminal IO. By default, the `docker run` command outputs the containers standard out to the hosts standard out, wherever that is currently pointing. Adding `-i` adds a standard input stream to the container, mapped to the host. Combining `-i` with `-t`, which adds a terminal driver by the way, will then allow you to interact with the containers OS.

After running the command, it will download the `ubuntu:default` image from Docker Hub and then execute the command `bash` inside of it to launch the bash shell. The output will look something like the following:

```sh
morgan@morgan-server:~$ docker run -it ubuntu bash
Unable to find image 'ubuntu:latest' locally
latest: Pulling from library/ubuntu
677076032cca: Pull complete 
Digest: sha256:f05532b6a1dec5f7a77a8d684af87bc9cd1f2b32eab301c109f8ad151b5565d1
Status: Downloaded newer image for ubuntu:latest
root@6d85a26869f2:/# 
```

We are now inside the container, with the last line of the above example showing us as the `root` user of the host container with the ID of `6d85a26869f2`. We can execute commands as if we are on another Linux OS, because we are in a way, but inside of a container image:

```sh
root@6d85a26869f2:/# ls
bin  boot  dev  etc  home  lib  lib32  lib64  libx32  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
```

If we type `exit` and leave the container, it will shut down. Run `docker ps -a` to see this:

```sh
CONTAINER ID   IMAGE                     COMMAND                  CREATED         STATUS                      PORTS     NAMES
6d85a26869f2   ubuntu                    "bash"                   3 minutes ago   Exited (0) 3 seconds ago              magical_keller
```

## Running a container in the background

If we don't want to immediately enter a container, but do want it up and running, we can pass the `-d` and `-it` flag to `docker run`:

```sh
docker run -dit ubuntu bash
```

The `-d`, or `--detached` in long form, flag will detach a container from the current terminal and run it in the background. We also passed `-i` and `-t` to make sure we can attach to the container stdin and stdout later on.

```sh
morgan@morgan-server:~$ docker run -dit ubuntu bash
13a869e58b46fe13b4c77b833d7d6ee02ea4804d8ac84aa0785bc23ea6eb00a9
```

The output is the `CONTAINER ID` that we would see in short-form as output of the `docker ps -a` command:

```sh
CONTAINER ID   IMAGE                     COMMAND                  CREATED          STATUS                      PORTS     NAMES
75f1df14c58b   ubuntu                    "bash"                   4 minutes ago    Up 4 minutes                          beautiful_johnson
6d85a26869f2   ubuntu                    "bash"                   12 minutes ago   Exited (0) 9 minutes ago              magical_keller
```

The container we just created has a `STATUS` of `Up 4 minutes`, indicating the container has been up for 4 minutes. Run `docker top <CONTAINER_NAME/ID>` to see what is currently happening inside the container, it specifically lists the running processors:

```sh
morgan@morgan-server:~$ docker top beautiful_johnson
UID                 PID                 PPID                C                   STIME               TTY                 TIME                CMD
root                10050               10029               0                   23:52               ?                   00:00:00            bash
```

### Attaching to a detached container

To attach a container that we have detached from, use the `docker attach <CONTAINER_NAME/ID>` command:

```sh
docker attach beautiful_johnson
root@75f1df14c58b:/# 
```

As long as the container was started with `-it`, we should be able to attach successfully and access the containers shell. If you press `CTRL-C` or type `exit`, this will terminate the containers `bash` shell which was started in the `run` command before:

```sh
docker run -dit ubuntu bash
```

Press `CTRL P` and then `CTRL Q` to detach from the container and return to your host. The Docker CLI will interpret this as the **read escape sequence** and detach you from the container without stopping it. Type `docker ps -a` to verify this:

```sh
CONTAINER ID   IMAGE                     COMMAND                  CREATED          STATUS                      PORTS     NAMES
75f1df14c58b   ubuntu                    "bash"                   5 minutes ago    Up 5 minutes                          beautiful_johnson
6d85a26869f2   ubuntu                    "bash"                   26 minutes ago   Exited (0) 23 minutes ago             magical_keller
```

The `beautiful_johnson` container is still up and running, so we could re-attach if we wanted to.

## Stopping a detached container

If you find yourself needing to stop a container, the `docker stop <COONTAINER_NAME/ID>` command will help you out - `docker stop` is short for `docker container stop`. This will stop the running container and print its name to the console when it is done:

```sh
morgan@morgan-server:~$ docker stop beautiful_johnson
beautiful_johnson
```

We can then delete the container using the `docker rm` command. If there are multiple containers to delete, specify them as a space separated list:

```sh
morgan@morgan-server:~$ docker rm beautiful_johnson magical_keller
beautiful_johnson
magical_keller
```

## Naming a container

When running a container, it is automatically given a generated name. We can override this and supply our own name by passing the `--name` flag and an argument to the flag to the `docker run` command:

```sh
docker run -dit --name my_container ubuntu bash
```

A quick `docker ps` reveals that the created container has the name `my_container`, specified in the command above:

```sh
CONTAINER ID   IMAGE                     COMMAND                  CREATED         STATUS                      PORTS     NAMES
64fec43342f4   ubuntu                    "bash"                   4 seconds ago   Up 3 seconds                          my_container
```

</div>