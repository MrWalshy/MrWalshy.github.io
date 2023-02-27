---
layout: layouts/post.njk
title: The basics of the Linux Command Line
thumbnail: /assets/images/devops/editor-prompt.png
description: Learn about the Linux command-line, how to work with files and directories and how to use Shell variable
date: 2023-02-27
author: Morgan Walsh
tags:
  - Linux
---

In Linux distributions, we are given a shell which can interface with the operating system; this is a command-line shell. We normally access this through some kind of **terminal** application, a favourite of the Linux community is the **Bash interpreter**.

When we first open a new terminal, we will see a prompt similar to the following:

```sh
user@server:~$ 
```

This is the command-prompt, it awaits us writing a command and pressing the Enter key to run it. Before the `@` is the name of the currently logged in user, after the `@` but before the colon is the host name of the server (computer) which the user is signed into. Following the colon is the current working directory (where we are in the file system), the tilde `~` represents the users home directory. After the current working directory is the prompt symbol, `$`, which is what the command we enter comes after:

```sh
morgan@home-server:~$ echo "Hello world"
```

- `echo` is the name of a Linux command
- Commands are case-sensitive

The `echo` command just displays the given output to wherever a thing called *standard out* is pointing, typically the console in which you enter the command. After running the command, we end up with a screen like the following:

```sh
morgan@home-server:~$ echo "Hello world"
Hello world

morgan@home-server:~$ 
```

Our command was executed and then the terminal returned to a prompt, waiting for us to input another command.

If we then wanted to clear our terminal, so it appeared as if we had never typed anything into it, run the `clear` command:

```sh
morgan@home-server:~$ clear
```

## Multi-line commands

A command may span over multiple lines, in which case we need to somehow indicate this to the command prompt. 

If we enter a backslash at the end of a line, this will allow us to split the command over multiple lines:

```sh
echo "Hello \
  world"
```

We can also use a **HereDoc** to indicate multiple-lines of input using the format:

```sh
[COMMAND] <<[-] 'DELIMITER'
  HERE-DOC
DELIMITER
```

- Line 1 has an optional command followed by the redirection operator `<<`
- Any string can be used as the delimiter
- Using `<<-` strips leading tab characters, allowing indentation to be used - this does not strip whitespace characters.
- Whitespace is not allowed in front of the delimiter which indicates the end of the HereDoc

Here is an example for writing multiple lines of text to a file:

```sh
cat <<- "EOF" > file.txt
    This is my file
    with multiple lines of text.
EOF
```

We redirect the output of the `cat` command into `file.txt`, the `cat` command gets its input from the HereDoc.

## Creating a directory

To create a new directory, use the `mkdir` command followed by the name(s) of the directory to create:

```sh
mkdir myDirectory1
mkdir myDirectory2
```

## Creating a file

There are many ways to create a new file in Linux, the simplest is the `touch` command:

```sh
touch somefile.txt
```

This creates the file `somefile.txt`.

We can also use the redirection operator for this purpose too:

```sh
> somefile.txt
```

We can provide input for the file before the redirection operator by specifying some command to run, but be aware this will overwrite any content in the file if it already exists:

```sh
echo "Hello world" > somefile.txt
```

What happens is the `echo` command takes in the string `"Hello world"` and outputs the text to standard output. It then feeds this as input (the `>`) into a file called `somefile.txt`, which is created if it doesn't exist - or overwritten if it does exist.

## Appending data to a file

We can use the redirection operator, `>>`, to append data to a file.

For example, create the file:

```sh
> somefile.txt
```

We can then append text to this file multiple times:

```sh
echo 1 >> somefile.txt
echo 2 >> somefile.txt
```

If we `cat somefile.txt` after running these commands, the following would be output to the console:

```sh
1
2
```