---
layout: layouts/post.njk
title: What is a Data Stream?
thumbnail: /assets/images/devops/editor-prompt.png
description: Learn about the different data streams involved in Linux which includes standard input, standard output and standard error.
date: 2023-02-27
author: Morgan Walsh
tags:
  - Linux
---

A data stream is the fundamental data structure involved in making Linux terminals work, a **data stream** being some way of passing information between processes on the system. The fundamental data streams used by Linux include:

- Standard Input (stdin)
- Standard Output (stdout)
- Standard Error (stderr)

## Standard Output

**Standard output** is a file in Linux called `/dev/stdout`. All data sent to `stdout` goes to this file, this is then watched by the Linux shell application which will interpret and execute commands, display information, etc...

## Standard Input

**Standard input** is a file in Linux called `/dev/stdin`, this file listens for information just like `stdout` - the difference is that other applications or scripts can read from this file.

We can manually get a line of input using the `read` command:

```sh
read line
```

This will then prompt us to enter a line of text and press enter, it is then stored in a variable called `line`. We can then output its content to standard output:

```sh
echo $line
```

## Standard Error

**Standard Error** is a file in Linux called `/dev/stderr`, this file listens for information as well - specifically, information which indicates an error. This allows us to treat the error data in a separate manner to the non-error data, which could be redirecting errors to log files or printing it out in a different colour.

## Piping a stream

We can pipe the `stdout` of one command to another command, converting it into `stdin`. We use the pipe symbol, `|`, for this. For example, we could feed the output of the `ls` command into the `grep` command to search for some specific file:

```sh
ls /dev | grep sda
```

This takes the output of `ls /dev` and feeds it as standard input to the `grep sda` command. This might then give us output like:

```sh
sda
sda1
sda2
sda3
sda4
```
