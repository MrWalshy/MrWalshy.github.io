@docArgs()
```
"title": "What is Middleware? | morganwalsh.dev", 
"links": ["/style.css"],
"scripts": ["/scripts/common.js"]
```

<div class="p-16 w-80 w-md-100 ml-auto mr-auto">

# Introduction to middleware in Express 4

**Middleware** is some software module that facilitates some operations and/or communication between other software modules. In Express, middleware functions are commonly used which have access to:

- the request object
- the response object
- the next middleware function in the app's request-response cycle

----------------------------

## Applying middleware in Express

Express applications are built up using a series of middleware function calls to handle the request-response cycle. This middleware may be of any of the following:

- application-level
- router-level
- error-handling
- built-in
- third-party

### Application-level middleware

Application-level middleware is bound to an express application instance using the `app.use()` and `app.METHOD()` functions.

When creating a route in the application, a callback is specified as middleware to the relevant `app.METHOD()` function:

```js
app.get('/', (req, res) => {
    res.send('GET');
});
```

This piece of middleware is called when a request is sent to the root path, `'/'`.

Usually, we also specify a third parameter in middleware functions, `next`, which represents a callback function of middleware to call after this function is done. For example, to create a piece of middleware which logs every request and information about it, we could create the following function:

```js
function logger(req, res, next) {
    console.log(`${req.method} ${req.path}`);
    next();
};
```

> The `next` parameter must be specified and called in this instance as we do not terminate the request, this accepts the next piece of middleware to run in the request-response cycle to prevent the request hanging.

The callback function can then be passed to `app.use()` to specify this is middleware to run on every inbound request:

```js
const express = require('express');

const port = 3000;
const app = express();

function logger(req, res, next) {
    console.log(`${req.method} ${req.path}`);
    next();
}

app.use(logger);
```

It is important to consider the order of how middleware is added as middleware added first will run first.

Middleware can also be specified to run on a specified route using `app.use()` as follows:

```js
app.use('/user', logger);
```

This example specifies the `'/user'` path as the first parameter to `app.use()`, the logger is the handler function acting as middleware. The logger function will now only be called on requests to the `/user` route.

We can also specify multiple callback functions to the `app.use()` and `app.METHOD()` functions, for example the following specifies the logger function on the `/user` route and a callback for what to do:

```js
app.get('/user', logger, (req, res, next) => {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const output = `Returning page ${page} consisting of ${pageSize} users`;
        console.log(output);
        next();
    }, (req, res, next) => {
        res.send([{"name": "fred123"}]);
    }
);
```

On line 1, the path argument is specified followed by the `logger` middleware function next. When a request is inbound, the `logger` middleware will run first, it will then pass control to the callback function (3rd argument) which logs the query parameters for `page` and `pageSize` to the Node.js console. The callback then calls `next()` on line 6 to call the final callback (4th argument) specified on line 7, which sends the response back to the client.

### Router-level middleware

**Router-level middleware** works like application-level middleware, but is instead bound to an instance of `express.Router()`. Instead of using the `app.use()` and `app.METHOD()` methods to apply middleware, `router.use()` and `router.METHOD()` methods are used.

The following example demonstrates using middleware at the router-level:

```js
const express = require('express');

const port = 3000;
const app = express();
const router = express.Router();

const users = [{"id": 1, "name": "fred123"}, {"id": 2, "name": "fred234"}];

function logger(req, res, next) {
    console.log(`${Date()} - ${req.method} ${req.path}`);
    next();
}

// no mount path, executed on every request to the router
router.use(logger);

router.get('/user', (req, res) => {
    res.status(200).send(users);
});

router.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(user => user.id == id);
    if (user) {
        res.status(200).send(user);
        return;
    }
    res.status(404).send(`User with id ${id} not found.`);
});

// mount router
app.use('/', router);

const server = app.listen(port, () => {
    console.log(`Server up on ${server.address().address}:${port}`);
});
```

The example allows either a whole collection of users to be returned, or a single user from that collection. The major differences from the application-level examples are:

- line 5: creating an instance of `express.Router()` 
- line 15,17,21: all use `router` instead of `app` to create endpoints
- line 32: mounts the `router` instance on the express `app`

### Error-handling middleware

**Error-handling middleware** functions like the other middleware functions seen so far, the major difference being that four arguments are required instead of three in the callback functions:

```js
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops, something went wrong...');
});
```

> If the `err` parameter is not specified, the callback will be treated like regular middleware and will not handle errors if used. Ensure the `err` parameter is specified for error-handling middleware!

Taking lines 31 - 36 from the previous example in **Router-level middleware**, the above error-handling middleware is usually added to the middleware stack after the router.

```js
// mount router
app.use('/', router);

// error handling if router bindings can't handle request or something else goes wrong
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops, something went wrong...');
});

const server = app.listen(port, () => {
    console.log(`Server up on ${server.address().address}:${port}`);
});
```

### Built-in middleware

Express includes built-in middleware functions for the most common behaviours in web applications:

- `express.static`: for serving static assets, i.e., html files, images, etc...
- `express.json`: for parsing incoming requests with JSON payloads
- `express.urlencoded`: for parsing incoming requests with URL-encoded payloads

### Third-party middleware

Third-party middleware functions can also be added to Express servers, a list of common middleware exists here: `https://expressjs.com/en/resources/middleware.html`

</div>