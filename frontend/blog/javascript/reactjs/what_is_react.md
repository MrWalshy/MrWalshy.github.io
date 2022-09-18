# What is React?

React is a user interface (UI) component library written and used in JavaScript by Facebook/Meta, it is used for building single-page applications for the web using reusable components.

--------------------------------

## Requirements

- Node.js: v16
- npm: v8
- HTML, CSS and JavaScript knowledge

Not required, but recommended, is a code editor for creating React applications. A commonly employed tool is [VS Code](https://code.visualstudio.com/) - a cross-platform code editor developed by Microsoft. You may also use a standard text editor if you wish...

## Why is React used?

React came about in 2011 when Facebook created it for their own use, it was open-sourced in 2013 to allow the wider developer community to use it. This doesn't explain why it is used though...

-----------------------

React is often used as it offers a different model of developing dynamic web applications, traditionally a web application would consist of multiple HTML, CSS and JavaScript files scattered about - the particular problem is HTML and JavaScript files would start to explode in number and size, thus creating a maintainability nightmare. React takes a different approach by combining markup syntax with JavaScript syntax, using something known as JSX. The combination of markup and JavaScript in one file allows for specialised and reusable components to be created, which can be plugged together to create a website.

This approach of modelling components requires us to think about our design ahead of time, for example consider a todo list on a web page. The todo list itself is a component:

```html
<ul id="todolist">
    <li class="todoitem">Todo item 1</li>
    <li class="todoitem">Todo item 2</li>
</ul>
```

Each list item inside the todo list can also be considered a component, as it is representing an element of the todo list.

React's JSX takes a more pragmatic approach in which we combine markup and code, an example of the above todo list in React might look like:

```js
const data = ["item1", "item2"];

<TodoList items={data} />
```

- It should be noted that we would have to create the TodoList component ourselves, it does not exist by default

What the above example highlights is:

- We can have JavaScript and markup in the same file
- We can create custom components which look syntactically like HTML elements
- We can specify attributes to components which pass data

Other notable reasons for why React is used include:

- Supported by Facebooks enourmous dev team which use the library internally
- Wide community support
- Browser tools for developing applications

The React browser tools are available on multiple platforms as a plugin/extension:

- [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)
- [Google Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Mozilla Firefox](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search)

## Creating a React project using create-react-app

The `create-react-app` tool is developed by Facebook to allow React applications to be quickly bootstrapped with an optimal setup which includes:

- Webpack for bundling modules of JavaScript and other resources in the build process
- Babel for transpiling modern JavaScript (ES6+) to older JavaScript
- ESLint for static analysis of React code as you write

As long as we have Node JS and npm installed, we can run `npx create-react-app my-first-react-app` to start the initialisation and further creation of a basic React app.

> Learn more about `create-react-app` here: https://create-react-app.dev/

When we run `npx create-react-app`, it is supplied a name for the project which may be an absolute or relative path. If no path is specified, it will create a new directory for the project in the current working directory where `create-react-app` was run.

After running the command, a project will be generated with the following structure:

The contents of a React projects directory:
![Structure of a React project](/img/javascript/reactjs/react-project-structure-example.png)

| Folder/File       | Description |
|-------------------|-------------|
| `node_modules`    | This directory stores downloaded dependencies, it should not be checked into version control. |
| `public`          | This directory contains the `index.html` page which holds a root container element for all other elements to be rendered inside. |
| `src`             | Contains the source code for the React app |
| `.gitignore`      | `create-react-app` initialises the project as a GitHub repository with a hidden `.git` folder by default. |
| `package-lock.json` | Tracks the dependencies of dependencies listed in `package.json` |
| `package.json`    | Lists the projects dependencies and other configuration information required for building the project. |
| `README.md`       | The standard quickstart documentation for a project, this is handily prefilled by the `create-react-app` command with useful information on how to run and build the project. |

At the time of writing (May 2022), `create-react-app` generates React version 18 projects.

## Running a React application

To run a React application, we must call an npm script that was created by the `create-react-app` tool - see the scripts section in `package.json`.

-----------------

To run the project, navigate to the root of the project and run: `npm run start`

This will start up the React application that was generated by the tool and open it in your default browser, this is hosted on your local machine and is not accessible to the internet *unless the ports have been forwarded by your router or firewall*.

> If a browser was not opened, ensure no errors where printed in the console when you ran the npm command and navigate to `localhost:3000` in your browser - note that `127.0.0.1` (local loopback address) can be used instead of `localhost` if wanted.

If everything went okay, your terminal output and browser should look like the following:

Successful compilation output example:

![Successful compilation example](/img/javascript/reactjs/successful-react-compilation-example.png)

- In my example, my port is 3001 as I already something running on port 3000. If this is the case for you, you will be prompted upon running the app with `npm run start` whether you want to choose a new port or not.

Default generated page for create-react-app projects:

![Default generated page](/img/javascript/reactjs/react-app-default-browser.png)

By default, the generated React app includes some source code inside `src/App.js` which is rendered into `public/index.html`.

## Where next?

A good next step would be to look inside the `src` folder, specifically at the `App.js` file which acts as the entry point of the application.

The developers and maintainers of React have developed some amazing documentation, alongside tutorials and guides for getting started: https://reactjs.org/

