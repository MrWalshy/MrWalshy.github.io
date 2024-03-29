---
layout: layouts/post.njk
title: What is Java?
thumbnail: /assets/images/programming/java-logo.png
description: A short discussion of what the Java programming language is...
date: 2023-02-01
author: Morgan Walsh
tags:
  - Programming
  - Java
---

---------------------------------------

Java is a general-purpose, object oriented, platform independent, simple, and robust programming language. You may have heard the motto write once, run anywhere, or something similar, meaning that a Java program can be written once and compiled once to run on all platforms that support Java.

## Benefits of using Java

- Encapsulation: Java includes keywords for protecting data from unintended access or modification.
- Platform independence: Java’s compilation and interpretation models allow for it to run on a wide array of platforms; essentially any platform that a Java Virtual Machine (JVM) exists for.
- Robust: The JVM automatically manages system memory and garbage collection, a process which prevents many mistakes common in languages like C from being made.
- Object oriented: Java uses the object-oriented programming paradigm, with the inclusion of functional behaviours from Java 8 onwards, to organise code.
- Secure: The JVM is a sandboxed environment which makes it more difficult for malicious code to be executed on a system.
- Backwards compatibility: The Java language has been designed with backwards compatibility in mind, meaning that each new version of Java is very likely to work with software written in older versions of Java.
- Multithreading: Java allows for multiple instructions to be executed at the same time using threads.

## Compilers and interpreters

To understand how Java works, we need to understand what compilation and interpretation mean in the context of software development.

-------------------------------------

Compilation is a process in which the work of converting source code, the code written in the programming language, to the machine language which can be understood by a digital processor – the name for this machine language is binary, a simple language consisting of 0s and 1s that is notoriously complex to work with directly.

- Compilation models often have an intermediary language of some form to act as an abstraction between the source code and the machine code, this can be a language called assembly which works directly with the hardware to produce the required sequences of 0s and 1s or a bytecode style language which operates similarly to assembly, bytecode languages are then usually translated into machine-level assembly code.
- Compiling source code to intermediary languages often benefits the development of the language itself as developers can use pre-existing tools that are simpler to use than raw binary code 
- We can say that source code is fed into a compiler which outputs the compiled form of the source, which is usually in the form of an executable file

A simple abstracted compilation model which translates instructions into some intermediary language might look like:

![Simplified generic compilation model](/img/java/simplified-compilation-model.png)

On the left, the start of the compilation model, is the source code, which is compiled into an intermediary language that can then be interpreted into machine code by some interpretation software.

An interpreter is different from a compiler, interpretation models dictate that source code is executed and converted to machine code as and when it is needed rather than being converted all at once.

> Interpreters may work with both compiled source code or direct source code, it depends on the implementation and the language.

A simple abstracted interpretation model might look like:

![Simplified generic interpretation model](/img/java/simplified-interpretation-model.png)

Here, the source code is converted into binary machine code, 0's and 1's.

## How do compilers and interpreters fit into Java?

Java is a language which goes through both compilation and interpretation, that is Java is traditionally known as a compiled language but does also include interpretation at a lower level.

-----------------------------------------------------------------

Java applications run using a special piece of software called the Java Virtual Machine (JVM), this software contains an interpreter and a just-in-time compiler (JIT compiler) which enables platform independence as all we need to run the code is a JVM on our machine. To run a Java app, we first must compile its source code into an intermediary language called bytecode; we can compile Java source code into bytecode using the Java Compiler (javac), a tool included in the Java Development Kit – a set of software required for developing Java applications:

![Java source code compilation](/img/java/compiling-java-src-code.png)

The Java compilation model is illustrated simply above, a ~.java~ file contains our source code which is fed into the Java compiler. The compiler then outputs a compiled ~.class~ file containing the compiled bytecode. This illustrates how we create compiled files, but the bytecode inside them has not yet been executed. 

To run compiled bytecode, we must feed the class files into the JVM and launch it using the java launcher included in the JDK:

![Java simple compilation model](/img/java/cross-platform-compilation-simple.png)

The Java bytecode (~.class~) files are fed into the Java Virtual Machine, the JVM is then capable of interpreting the bytecode into the correct machine code dependent on the platform it is running on.
 
The full compilation model looks as follows:

![Java full compilation and interpretation model](/img/java/full-compilation-model.png)

Just-in-time compilation is a process the JVM carries out to optimise code at runtime after the code has been compiled. The JVM is designed to look for frequently executed chunks of code when running, if a frequently executed block of code is found it will be compiled into native code to reduce performance deficits caused by frequently interpreting the same bytecode – essentially, compilation is almost always faster than interpretation for frequently used areas of code.
