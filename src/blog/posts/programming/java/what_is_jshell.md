---
layout: layouts/post.njk
title: What is JShell?
thumbnail: /assets/images/programming/java-logo.png
description: JShell is a tool introduced in Java 9 for interactive programming, this article gives a brief overview of its usage.
date: 2023-02-01
author: Morgan Walsh
tags:
  - Programming
  - Java
---


JShell is a REPL tool, Read-Eval-Print-Loop, for experimenting with Java code to get immediate results.

-------------------------------

## Opening JShell

To open the JShell tool, ensure you have Java on your system path and enter jshell into the console. 
You should see something like the following if JShell opened correctly:

```
$ jshell 
| Welcome to JShell -- Version 17.0.1 
| For an introduction type: /help intro

jshell> 
```

## Useful commands

The following commands will be useful for interacting with JShell:

| Command             | Description                                                                  |
|---------------------|------------------------------------------------------------------------------|
| `/exit`             | Exits the JShell tool                                                        |
| `/list`             | Lists a history of executed code snippets                                    |
| `/save snippet.txt` | Saves all entered code snippets in the current session to the specified file |
| `/open snippet.txt` | Opens and loads the code snippets from the specified file                    |
| `/reset`            | Resets the state of the JShell tool, deleting all snippets in its history    |
| `/help`             | Opens the help menu                                                          |
| `/vars`             | Lists declared variables                                                     |

## Exploratory programming

In Java, we can perform the standard Arithmetic operations like addition, subtraction, multiplication, and division. If I enter `3 + 3;` into JShell for example, I will get the following result:

```
jshell> 3 + 3; 
$1 ==> 6 
```

What has happened here is that the Java code has been executed and a temporary variable has been created to store the result of the addition, a *variable* stores data for us and has an associated name. If I enter the name of the new variable, `$1`, into the console it will return `$1 ==> 6` – this is informing us that the variable named `$1` points to the value of `6`. We can also pass a variable as input to a method, where a *method* is just a reusable block of code with a name, such as with the `println()` method:

```
jshell> System.out.println($1); 
6
```

Try entering the following expressions into JShell and noting their results:

- `3 * 3`
- `3 / 3`
- `3 / 0`
- `3 - 3`
- `(3 + 3) * 3`
- `3 + 3 * 3`
