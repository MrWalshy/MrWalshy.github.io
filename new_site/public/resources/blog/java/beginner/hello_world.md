# The canonical Hello World

A commonality amongst programmers is that in any new language we meet, we write a `“Hello World!”` program – a simple application which will output those exact words to the screen.

------------------------------------

To follow along, first create a new file called `Runner.java` in a directory of your choice: 

```bash
mkdir hello-world 
cd hello-world 
touch Runner.java 
```

The above `touch` command is not available on WIndows by default, please ensure if on Windows you are using Git Bash or the Windows Subsystem for Linux (WSL)... Or you could just use `echo` with the redirection operator like so: `echo > Runner.java` :)

Once we have created the file, type `notepad Runner.java` to open the file in the Notepad application on Windows or use `nano Runner.java` to use the nano text editor in the console (Git Bash on Windows only, usually preinstalled on Linux/GNU based systems). Then type in the following code: 

```java
public class Runner { 

    public static void main(String[] args) { 
        System.out.println(“Hello world”); 
    } 
}
```

Once you have entered the code, save, and exit back to the console. Then type the following commands (except comments starting with a hash symbol) to compile and run our code:

```bash
# compile the Runner.java file as a class file using the javac tool 
javac Runner.java 
# run the compiled class file (which is in the same directory) using the java tool 
# - do not specify .class or the compiled file will not be executed 
java Runner
```

- Adding `.class` to the java Runner command will produce a class loader error, where the JVM was not able to load the specified class file.

If done correctly, you will see something like the following outputted in the console window:

```bash
Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/hello-world 
$ javac Runner.java

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/hello-world 
$ java Runner Hello world
```

## Program breakdown

A lot is going on in the background to make our program run, we are already aware of this; now it is time to investigate the structure of how we write our programs.

--------------------------

Java is an object-oriented language, it uses the construct of a class to represent a component in a software system – a component could be the representation of physical things like a customer, an animal, a tree or even non-tangible logical things like mathematical formula or graphs. 

- A class is a blueprint which defines the data and behaviours that describe some object. 

In the Hello World example, we create a class called `Runner`: 

```java
public class Runner {

}
```

- The first line declaring the class, `public class Runner`, is known as the class header.
- `public` is a special Java keyword known as an access modifier, just know that for now it means that any other class can use the class called `Runner`.
- `class` is another Java keyword used to signify that we are creating a class, a blueprint.
- `Runner` is the name of the class, we can choose a name other than `Runner` if we would like.
- The curly braces signify the body of the class, this contains code that belongs to the class.
- Code outside of a class is an error in Java, Java code must live inside a class aside from package declarations, imports, and class declarations.

Inside the class body, there is a special unit of code known as a method: 

```java
public static void main(String[] args) { 
    System.out.println(“Hello world”);
}
```
 
A method is a self-contained, reusable block of code that can be called/invoked by another method. The main method shown above is a special type of method that indicates to the JVM that the program should start here. 

- `public static void main(String[] args)` is the method header, this identifies the methods accessibility, output, name, and inputs.
- All of the code between the curly braces after the method header is in the method body, this is the code that is executed when a method is invoked and belongs only to that method.

Complete instructions of code in Java, aside from blocks of curly brackets, must end with a semi-colon to be valid. The semi-colon used to terminate a programming statement is known as a delimiter.

To invoke a method, we specify the name of the method followed by a set of parentheses. In the previous example, we use a special method called `println()`, accessible via a field (a piece of memory storing data) on the `System` class, to print output to the console. If we called that method without any input, it would look like: `System.out.println();`

- An empty `println()` statement would print a new line character to the console (an empty line) as we have not passed it any input inside its parenthesis.
