---
layout: layouts/post.njk
title: How to setup SSH
thumbnail: /assets/images/devops/editor-prompt.png
description: This post demonstrates how to setup an SSH server and connect to it remotely
date: 2023-02-01
author: Morgan Walsh
tags:
  - SSH
  - DevOps
---

**SSH** (*Secure Shell*) is a network protocol used for remotely accessing a computer. 

- Mac and Linux distributions normally come with `ssh` installed
- Windows may require some work

## Connecting to a server with SSH

To `ssh` into a remote host, we use the `ssh` command followed by the remote host name (IP or domain):

```sh
ssh host
```

This method will assume your username on the remote system is the same as the system you are running the `ssh` command from. We can also specify a specific username:

```sh
ssh user@host
```

## `sshd`

`sshd` is a daemon process, it is the server which listens for an `ssh` client connection. The `ssh` program is the client.

We can control the `ssh` server on Ubuntu using the `systemctl` command for managing services:

```sh
# start ssh server
sudo systemctl start ssh

# enable ssh to run automatically at boot
sudo systemctl enable ssh

# stop ssh server
sudo systemctl stop ssh

# restart ssh server
sudo systemctl restart ssh
```

## Configuring SSH

The configuration for the `sshd` server in Ubuntu is found at `/etc/ssh/sshd_config`. First, backup this file:

```sh
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
```

Options that you may want to change in this file include:

- `Port 22`: Change the port number to change where the `sshd` server is listening for connections
- `HostKey /etc/ssh/ssh_host_xxx_xxx`: Specifies where to search for global host keys
- `SysLogFacility AUTH`: A logging level
- `LogLevel INFO`: A logging level
- `LoginGraceTime 120`: The number of seconds to keep a connection alive without successful login
- `PermitRootLogin yes`: Sets whether the root user can log in (should be changed to `no` once a user account with access to elevated priviledges is created)
- `StrictModes yes`: Refuses a login attempt if auth files are readable by everyone
- `X11Forwarding yes`: Allows viewing the GUI of the `sshd` host
- `X11DisplayOffset`

### Configuring a keypair

To create a keypair, use the `ssh-keygen` command:

```sh
ssh-keygen -t rsa
```

Accept the defaults, this will create two files:

- `id_rsa`: The private key file (keep this secure)
- `id_rsa.pub`: The public key file

#### Configuring from the server

If you ran `ssh-keygen` from the server, follow the next instructions.

1. Create the `.ssh` directory and `.ssh/authorized_keys` file if they don't already exist
   
    ```sh
    mkdir ~/.ssh
    touch ~/.ssh/authorized_keys
    ```

2. Change the permissions of the directory and file if they didn't exist

    ```sh
    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
    ```

3. Append the contents of the public key to the `authorized_keys` file

    ```sh
    cat id_rsa.pub >> ~/.ssh/authorized_keys
    ```

4. Download the `id_rsa` private key file and use it to connect to your server:

    ```sh
    ssh -i id_rsa user@server
    ```

#### Disabling password authentication

After setting up SSH keys, disable password authentication to improve server security:

1. SSH into the host

    ```sh
    ssh -i key user@host
    ```

2. Open the `sshd` configuration file

    ```sh
    sudo nano /etc/ssh/sshd_config
    ```

3. Set the `PasswordAuthentication` line to `no`

    Find the following line in `sshd_config`:

    ```sh
    PasswordAuthentication yes
    ```

    Change the value to `no`:

    ```sh
    PasswordAuthentication no
    ```

4. Save and exit the editor

5. Enable changes by restarting the `sshd` service

    ```sh
    sudo systemctl restart sshd.service
    ```

#### Configuring a new account with SSH

The following steps will highlight how to create a new user account, enable SSH and give them sudo permissions.

- In the following commands, replace `<user>` with the name of the user you want to create

1. Access the server which you want to create a new account on and access the root user:

    ```sh
    sudo su
    ```

2. Create a new user and the .ssh directory

    ```sh
    adduser <user>
    mkdir /home/<user>/.ssh
    ```

3. Generate a key pair

    Set the file location as: `/home/<user>/.ssh/id_rsa` when prompted by the `ssh-keygen` command:

    ```sh
    ssh-keygen -t rsa
    ```

4. Copy the public key into an authorized_keys file

    ```sh
    cat /home/<user>/.ssh/id_rsa.pub > /home/<user>/.ssh/authorized_keys
    ```

5. Add the user to the users allowed to ssh

    Open the file `sshd_config` (Ubuntu):

    ```sh
    nano /etc/ssh/sshd_config
    ```

    Find the line beginning with `AllowUsers`, if it does not exist add it to the file. The line should look something like:

    ```sh
    AllowUsers <user1> <user>
    ```

    - if the line already exists, add your user after a space

    Save and close the file.

6. Change the owner of the `.ssh` directory to the new user

    ```sh
    chown -R <user>:<user> /home/<user>/.ssh
    ```

7. Restart `sshd`

    ```sh
    systemctl restart sshd
    ```

8. (Optional): Give new user superuser permissions

    Run the `visudo` command to open the sudoers file. Add under user permissions, the following line:

    ```sh
    %<user> ALL=(ALL) NOPASSWD: ALL
    ```

9.  Download your private key

    Once you are setup, make a copy of the private key on a machine you want to use to access the server.
