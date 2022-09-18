# Introduction to NPM

The Node Package Manager can be used to create NodeJS packages, these can be redistributable libraries or full applications that may run desktop or web applications.

## Creating a project with NPM

First, ensure you have the latest version of Node JS installed, this was `16.15.0 LTS` at the time of writing: [[https://nodejs.org/en/][NodeJS | Home page]]

Bundled with Node JS is the NPM.

To quickly initialise a project using NPM, create a directory for your project and run `npm init .` inside of the directory.

This will trigger the legacy interface at which you will be prompted for information, this can be entered or skipped - afterwards a file called `package.json` will have been created for tracking information about the project, including its dependencies.

Fields include:

| Field             | Description | 
|-------------------|-------------|         
| `author`          | Specifies who created the project, can be passed a simple string or an object. |
| `description`     | A short informative description of the project, useful for selling an idea to a user and summarising a projects functionality. Accepts a string. |
| `keywords`        | Accepts an array of double-quoted strings describing the project. |
| `license`         | Used to specify the projects license, MIT and BSD are common open source licences. License info is not required, copyright ownership is usually implied in a lot of countries, although this may differ. |
| `dependencies`    | Accepts an object of key value pairs of strings representing a dependency to install. The structure is as follows: `"package-name": "version". |
| `version`         | Accepts a string representing the version of the project. |

## Semantic versioning (SemVer)

Semantic Versioning is an industry standard for software versioning to make dependencies easier to manage, SemVer looks as follows:

```json
"package": "MAJOR.MINOR.PATCH"
```

- `MAJOR` signifies changes to the API which are incompatible with previous versions
- `MINOR` indicates backwards-compatible additional functionality.
- `PATCH` indicates backwards-compatible bug fixes.

## Managing dependency versions

If the tilde character is appended to an npm dependency in the `package.json` file, it will allow the dependency to update to the latest `PATCH` version when `npm install` is ran in the project:

```json
{
  "dependencies": {
    "package": "`1.2.2"
  }
}
```

The caret character allows npm to install the latest `MINOR` and `PATCH` updates:

```json
{
  "dependencies": {
    "package": "`1.2.2"
  }
}
```

## Creating a project (in-depth)

[[https://www.npmjs.com/][npmjs]]

The `npm init` command, aliases being `npm create` and `npm init`, is used to setup a new or existing npm package.

The `init` command is transformed to an `npm exec` operation, the one for creating a new project in the current directory is as follows: `npm init .`

This will initialise a project using legacy init behaviour, questions will be asked at the command-prompt as follows before creating a **package.json** file for you:

```sh
Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test/node
$ mkdir npm-example1

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test/node
$ cd npm-example1

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test/node/npm-example1
$ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (npm-example1)
version: (1.0.0)
description: npm Example one
entry point: (index.js)
test command:
git repository:
keywords: npm javascript node
author: Morgan Walsh
license: (ISC)
About to write to C:\Users\Morgan Walsh\test\node\npm-example1\package.json:

{
    "name": "npm-example1",
    "version": "1.0.0",
    "description": "npm Example one",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [
        "npm",
        "javascript",
        "node"
    ],
    "author": "Morgan Walsh",
    "license": "ISC"
}


Is this OK? (yes)
```

First, we navigate into a new directory for the project with `mkdir` and `cd`, then the `npm init` command is run to start initialisation of the package. A set of questions are asked concerning project-related information, these may be skipped by passing a flag: `npm init --yes`

An `ls` of the directory shows that we only have a **package.json** file present, containing data about the project. We should also add an **index.js** as we left this as the default entry point for the application in the configuration:

```sh
Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test/node/npm-example1
$ ls
package.json

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test/node/npm-example1
$ touch index.js

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test/node/npm-example1
$ echo "console.log('Hello world')" > index.js 
```

Run the project using `node index.js` from the project root:

```sh
Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test/node/npm-example1
$ node index.js 
Hello world
```

## Installing dependencies

If a project has an existing **package.json** file, run `npm install` to install all of the projects depdencies into the **node_modules** folder.

> **node_modules** will be created if it isn't already by the command

To install a specific package, run `npm install <package-name>` to add the `<package-name>` to the **package.json** files dependencies.

- Historically, prior to NPM 5, the `--save` / `-S` flag was added otherwise the dependency would not be saved to the **package.json** file
  
There are two types of install available in NPM:

- local
- global

Try `npm install morgan` to install me locally into your project... Just kidding, but it will install a middleware logging utility for Node.js requests and responses. The local dependecy will be added to the **package.json** file alongside its version number:

```json
{
    "dependencies": {
        "morgan": "^1.10.0"
    }
}
```

The `morgan` dependency is of version `1.10.0`. As it is a local dependency, it will also download the packages code to the **node_modules** directory - the **morgan** dependency is just another npm project.

> Ensure you do not push the **node_modules** folder to GitHub, or another repository service, due to its large size. These dependencies can be redownloaded as required.

Global installs are available in every npm project, just add the `-g` flag to do this. For example:

```sh
npm install -g morgan
```

will download the `morgan` npm package for global usage in any project. To see its install location, use `npm root -g` to find the location - I wouldn't recommend this though.

### Applying the morgan logger with a vanilla HTTP server in Node.js

```js
const http = require('http');
const morgan = require('morgan');

const host = 'localhost';
const port = 3000;

const logger = morgan('dev');

const server = http.createServer((req, res) => {
    logger(req, res, err => {
    
        res.setHeader('Content-Type', 'text/plain');
        if (err) {
            console.log(err);
            res.statusCode = 500;
            res.end('Something went wrong');
            return;
        }
        res.statusCode = 200;
        res.end('Hello');
    });
});

server.listen(port, host, () => {
    console.log(`Server up on ${host}:${port}`);
});
```

The morgan logging function takes in a request, response and a callback for handling the request. The logger wraps around the request-response cycle so that it can print related information to the console. Place this code in a file called `index.js` and run it with `node index.js` to start the server, then send a request in the browser to `localhost:3000` and monitor the console.

## Updating dependencies

Packages often require updates to keep up with modern features and security, all specified dependencies can be updated using `npm update`. Specify a specific package to update as follows: `npm update <package-name>`.

## Running tasks

Command-line tasks can be specified in the **package.json** file in the `"scripts"` section. The following example adds a `start` task for starting the server:

```json
{
    "scripts": {
        "start": "node ./index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    }
}
```

The `start` task can then be run using `npm start`:

```sh
Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test/node/npm-example1
$ npm start

> npm-example1@1.0.0 start
> node ./index.js

Hello world
```

Custom scripts beyond `start` and `test` can be defined, for example:

```json
{
    "scripts": {
        "start": "node ./index.js",
        "start:dev" "PORT=8080& node index.js"
        "test": "echo \"Error: no test specified\" && exit 1"
    }
}
```

To run the custom `start:dev` task, we must specify `npm run start:dev` instead of just the `npm` command by itself.
