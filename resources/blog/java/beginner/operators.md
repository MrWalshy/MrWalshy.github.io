# Java Operators

----------------------------------------------------

The Java language contain **operators** - characters which apply an operation - which can be applied to variables, values, or literals. The values used with an operator are known as its *operands*. For example, in `3 – 4`, `3` is the left operand, `-` is the operator and `4` is the right operand.

Java has three types of operation:

- **Unary**: Unary operators have one operand 
- **Binary**: Binary operators have two operands 
- **Ternary**: Ternary operators have three operands

## Operator precedence and associativity

Operators, like in Maths, have a **precedence** – that is, we perform multiplication before addition for example. Java follows the *BIDMAS* / *BODMAS* rules for arithmetic operators but does also include additional operators for additional functionality.

-------------------------------------

**Associativity** is the way in which an expression is evaluated, an **expression** is made up of variables, operators and method invocations and returns a single value, whether that value is nothing or something. In the following examples, the parts highlighted in bold are expressions:

- `int *age = 30*;`
- `String *name = “Bob”*;` 
- `System.out.println(*name + “ is “ + age + “ years old.”*);`
- `System.out.println(*name.toUpperCase()*);`
- `int *mathExpression = 3 + 3*;`
- `(*3 + 3*)`
  
What we can see is that assignments are expressions, the value `30` is assigned to the `age` variable for example. **Arithmetic operations** are also expressions, the result of the right is assigned to the variable on the left.

Onto **associativity** though, all it means is that an operation is carried out in a certain direction: left-to-right or vice-versa.

> If two operators have the same precedence, they are carried out according to their associativity

The following table lists the operators from highest to lowest precedence with their associated associativity’s:

| Operator                        | Symbols and examples                              | Associativity |
|---------------------------------|---------------------------------------------------|---------------|
| Miscellaneous                   | [], (), .                                         | Left -> right |
| Post-unary operators            | expression++, expression--                        | Right -> left |
| Pre-unary operators             | ++expression, --expression                        | Right -> left |
| Other unary operators           | -, !, ~, +, (type), new                           | Right -> left |
| Multiplication/division/modulus | *, /, %                                           | Left -> right |
| Addition/subtraction            | +, -                                              | Left -> right |
| Shift operators                 | <<, >>, >>>                                       | Left -> right |
| Relational operators            | <, >, <=, >=, instanceof                          | Left -> right |
| Equality operators              | ==, =                                             | Left -> right |
| Bitwise Logical operators       | &, ^, $\vert$ (AND before XOR, XOR before OR)     | Left -> right |
| Short-circuit logical operators | &&, $\vert\vert$ (AND before OR)                  | Left -> right |
| Ternary operators               | boolean expression ? expression1 : expression2    | Right -> left |
| Assignment operators            | =, +=, -=, *=, /=, %=, &=, ^=, $\vert$=, <<=, >>=, >>>= | Right -> left |

## Applying different operator types

### Unary operators

Unary operators can only be applied to a single value, the following table lists the unary operators:

| Operator | Description                                                                    |
|----------|--------------------------------------------------------------------------------|
| !        | The logical complement operator flips the value of a boolean expression.       |
| +        | The additive operator indicates that a number is positive.                     |
| -        | The negation operator indicates a number is negative or negates an expression. |
| ++       | The increment operator increments a value by 1.                                |
| --       | The decrement operator decrements a value by 1.                                |
| (type)   | The cast operator casts a value to the specified type.                         |

You may have noticed that the increment and decrement operators can be prefixed or suffixed to a variable:

- *Postfix-increment* and *postfix-decrement* will first return the current value of the variable, and then they will increment or decrement its value by 1
  
- *Prefix-increment* and *prefix-decrement* will first increment or decrement the current value of the variable by 1, and then return the value of the variable.
   
The `(type)` operator allows us to convert variables of a certain type to a variable of a related type, such as converting a double to an int in the above table, this will be explored further in numeric promotion.

### Arithmetic operators

**Arithmetic operators** are binary operators, this means an operator is applied to two operands. The following table lists operators:

| Operator      | Description |
|---------------|-------------|                                                                                  
| +             | The additive addition operator returns the sum of two numeric values. |
| -             | The subtraction operator returns the difference of two numeric values. |
| *             | The multiplication operator returns the product of two numeric values. |
| \             | The division operator returns the quotient of the dividend and the divisor (numerator and denominator in fractions) |
| %             | The modulus operator returns the remainder after dividing the dividend by the divisor. The returned value is always a whole number, this means it will truncate any values after the decimal point. |

The default order of operations for arithmetic operators follows that of BIDMAS/BODMAS: 

- Brackets
- Indices 
- Division, Multiplication 
- Addition, Subtraction

This means we can give certain parts of our expression’s higher precedence:

```java
int num1 = (3 + 3) * 10 – 50; // -17
int num2 = 3 + 3 * 10 – 50; // 10 
```

Adding a set of parentheses around the addition changed the way in which the expression was evaluated, which changed the result. 

#### Numeric promotion

When performing arithmetic operations upon numeric types, we may mix types like an integer and a double in the same expression:

```java
double num = 3.0 + 3; 
```

Each primitive data type has a size – numerical types included. This means technically that an 8-bit number (byte) is also a 16-bit number (short), but a 16-bit number is not an 8-bit number as it is too large. For example, if we declare and initialise a variable of type byte, we can assign it to a primitive data type that holds a larger numeric value:

```java
byte smallNum = 64; 
short convertedNum = smallNum; // 64
```

> This can occur because a byte (8-bits) can fit in a short’s (16-bit) memory space on your hardware.

If we tried to assign a short to a byte, or an int to a short we would get an error as a short is too large to fit in a byte and an integer is too large to fit into a short:

```
jshell> int bigNum = 3234254; 
bigNum ==> 3234254 

jshell> byte uhOh = bigNum; 
| Error: 
| incompatible types: possible lossy conversion from int to byte 
| byte uhOh = bigNum; 
|             ^----^
```

JShell will give us a warning about **lossy conversion**, it is indicating that an integer value is too large to fit in a byte and that doing so would cause a loss of accuracy (numbers/data). To get around this, we can use typecasting to *widen* or *narrow* the type:

- *Widening* the type means making a type larger, i.e., assigning a byte to an int variable
  
- *Narrowing* the type means making a type smaller, i.e., assigning an int to a byte variable
  
If we wanted to put the large `bigNum` variable into a byte variable, we can by explicitly casting `bigNum` to a byte, but we will lose data if the value is too large for the desired narrower type:

```
jshell> byte lostMaData = (byte) bigNum; 
lostMaData ==> -50 
To fit into a byte, we need a number smaller than 256: 
jshell> byte didNotLoseData = (byte) smallNum; 
didNotLoseData ==> 32
```

*Rules of numeric promotion*:

1. If the left and right operand are of different types, the smallest type will be promoted to the largest. For example, `78938 + 92374893L` contains an integer and a long, the integer `78938` will be promoted to a Long of the form `78938L`.
   
2. If the left or right operand is an integral type and the other a floating-point type, the integral type would be promoted to a floating-point type. For example, `3 + 4.0` contains an integer and a double, the integer `3` will be promoted to a double of the form `3.0`.
   
3. The small data types of byte, short, and char are first promoted to an int when used with any arithmetic operator, even if neither operator is an int.
   
4. After all promotions have been made, the result will be of the same type as the expressions operands.

### Assignment operators

*Assignment operators* are used to assign the result of an expression to a variable. The simplest is the standard assignment operator represented by the equal’s sign:

```
jshell> int bigNum = 3234254 + 1; 
bigNum ==> 3234254
```

Assignment operators have a right-to-left associativity, this means that the right operand is evaluated before the left.

An assignment is an expression, and thus also can return a result to be used in another assignment: 

```
jshell> int a = 3;
a ==> 3 

jshell> int b = (a *= 3); 
b ==> 9
```

#### Compound assignment operators

Compound assignment operators extend the ability of the standard assignment operator and give a short-hand way of writing out simple expressions, the most common compound assignment operators being:

| Operator          | Description |
|-------------------|-------------|
| +=           | The additive compound assignment operator returns the sum of two numeric values. |
| -=           | The subtraction compound assignment operator returns the difference of two numeric values. |
| *=           | The multiplication compound assignment operator returns the product of two numeric values. |
| /=           | The division compound assignment operator returns the quotient of the dividend and the divisor (numerator and denominator in fractions) |
| %=           | The modulus compound assignment operator returns the remainder after dividing the dividend by the divisor. The returned value is always a whole number, this means it will truncate any values after the decimal point. |

To understand compound assignment operators, you just need to understand how they expand out to a full expression. For example, `num1 += num2;` is the same as writing `num1 = num1 + num2;` and `num1 -= num2;` is the same as writing `num1 = num1 – num2;`.

### Comparison operators

Java contains many different comparison operators which are used in the creation of Boolean logic expressions, that is an expression using the logic rules originally set out by George Boole in the 19th century. The equality and relational operators are used to produce true or false values from the comparison of numbers whereas boolean logic operators introduce the core Boolean logic.

#### Equality operators

There are two equality operators in Java, one for comparing if two values or objects are equal and another for comparing if they are not equal:

| Operator          | Applied to primitive types | Applied to reference types |
|-------------------|----------------------------|----------------------------|
| ==      | The equality operator returns true if the left operand is equal to the right operand, otherwise false. | Returns true if the left and right operands refer to the same object reference, otherwise false. |
| !=           | The inequality operator returns true if the left operand is equal to the right operand, otherwise false. | Returns true if the left and right operands do not refer to the same object reference, otherwise false. |

Examples:

```java
int num1 = 30; 
int num2 = 60; 
boolean isEqual = (num1 == num2); // false
isNotEqual = (num1 != num2); // true 
boolean isNotEqualAlt = !(num1 == num2); // true
```

### Relational operators

Relational operators compare two numeric operands, aside from the instanceof operator:

| Operator         | Description |
|------------------|-------------|
| <                | The less than operator returns true if the left operand is smaller than the right operand, otherwise it returns false. |
| <=               | The less than or equal to operator returns true if the left operand is smaller than or equal to the right operand, otherwise it returns false. |
| >                | The greater than operator returns true if the left operand is larger than the right operand, otherwise it returns false. |
| >=               | The greater than or equal to operator returns true if the left operand is larger than or equal to the right operand, otherwise it returns false. |
| a instanceof b   | The instanceof operator returns true if the left operand is an instance of a class or subclass, or interface as specified in the right operand.  |

### Boolean logic operators

*Boolean logic operators* are applied to the boolean data type, these are useful for creating conditions in our software and creating logic. There are three boolean operators in Java, but these three operators may be applied in a variety of ways – even to numbers in when using bitwise operators. The three common operations are AND, OR and XOR.

#### Logical operators

*Logical operators* may be applied to both numeric and boolean data types, they are known as a bitwise operator when applied to numbers and perform different logic then next described. The logical operators are as follows:

| Operator        | Description  |
|-----------------|--------------|
| $\amp$          | The logical AND operator returns true if both the left and right operands are true, otherwise it returns false. |
| ^               | The logical XOR operator returns true if only one of the left and right operands is true, otherwise it returns false. |
| $\vert$         | The logical OR operator returns true if either the left or right operands, or both, are true, otherwise it returns false. |

In a logical expression, both operands will always be checked unlike short-circuit operators…

#### Short-circuit operators

*Short-circuit operators* are a special kind of boolean operator that can only be applied to the boolean data type, the following table describes the short-circuit operators:

| Operators         | Description |
|-------------------|-------------|
| &&                | The short-circuit AND operator returns true if both the left and right operands are true, otherwise it returns false. The right operand is only checked if the left is true. |
| $\vert\vert$      | The logical OR operator returns true if either the left or right operands, or both, are true, otherwise it returns false. The right is only checked if the left is false.    |

Short-circuit AND:

```java
bool result = true && true; // true, both checked 
result = true && false; // false, both checked 
result = false && false; // false, right operand never gets checked
```

Short-circuit OR:

```java
  bool result = true || false; // true, only left checked 
  result = true || true; // true, only left checked 
  result = false || false; // false, both checked
```

### Ternary operator

The *ternary operator* is a special operator that is used for short conditional statements that return one of two specified values, the ternary operator has three operands and takes the form:

```java
boolean result = (boolean_expression) ? result_if_true : result_if_false;
```

A special rule about ternary expressions is that they always return a value, hence why there is an assignment occurring to the boolean result. The `(boolean_expression)` is exactly that, a set of values combined with the boolean logic operators, comparison operators, relational operators, or a mix.

A boolean expression that checks if the temperature is above 30 is demonstrated below: 

```
jshell> int temp = 28; 
temp ==> 28 

jshell> boolean isRaining = (temp > 30); // false 
isRaining ==> false
```

If we wanted to get a string that states, `“It is too hot”` when the temperature is above 30 or `“It is just right for me”` otherwise, we can plug the expression `(temp > 30)` into the first operand of the ternary expression. This gives us:

```java
String statement = (temp > 30) ? result_if_true : result_if_false;
```

We now have a semi-complete statement; the next two operands are what values should be returned if the boolean expression is `true` or `false` respectively. All we must do is put in the string literals containing the values we want in this case:

```
jshell> int temp = 28; 
temp ==> 28 

jshell> String statement = temp > 30 ? "It is too hot" : "It is just right for me"; 
s ==> "It is just right for me"
```

We could then print the `statement` string to the console or use it somewhere else.

## Exercises

1. Use 1 of each of the arithmetic operators and assign the result of the expression you make to a variable. 

2. Use 1 of each of the compound assignment operators and assign the result of the expression you make to a variable. 

3. Boolean expressions can be compounded, that is they can have multiple conditions in them:

    ```java
    boolean isRaining = true; 
    boolean isSunny = false; 
    boolean isCloudy = true; 
    boolean isRainingAndSunnyOrCloudy = isRaining && isSunny || isCloudy;
    ```

    In the above expression, the `isRaining && isSunny` expression is executed first, which results in `false`. The expression then becomes `false || isCloudy`. This then returns `true`, which is the correct result, but the logic of the expression is wrong. If we change `isRaining` to `false`, we will still get `true` back.

    Task: Insert parenthesis to make the boolean expression evaluate correctly.

4. Given the integer `age` and double `hourlyRate`, create a boolean expression that checks if the age is greater than 18 but less than 21 and their hourly rate is greater than or equal to £6.83, i.e., that they are earning at least minimum wage for their age range in the UK at the time of writing (early 2022):

    ```java
    int age = 18; 
    double hourlyRate = 7.00; 
    double minWageEighteenToTwenty = 6.83;
    ```

5. Boolean expressions can be created to check if a number is even or odd by using the modulus operator, for example:

    ```
    jshell> boolean isOdd = (31 % 2) == 1; 
    isOdd ==> true
    ```

    The above expression can be used to check if a number is odd, replace ~31~ with other values to check if they are odd and then create a boolean expression to check if a number is even.
