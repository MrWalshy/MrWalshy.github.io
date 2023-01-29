@docArgs()
```
"title": "What is Routing? | morganwalsh.dev", 
"links": ["/style.css"],
"scripts": ["/scripts/common.js"]
```

<div class="p-16 w-80 w-md-100 ml-auto mr-auto">

# An introduction to routing middleware in Express 4

**Routing** refers to how an application responds to incoming client requests to a particular endpoint, this endpoint consisting of a URI/path and a HTTP method indicating the type of the request.

----------------
## Routing requests

Incoming requests can be routed using a variety of methods available on the `Express` instance that we create, these methods take the form: `app.HTTP_METHOD(PATH, HANDLER)`

- `HTTP_METHOD` is some HTTP request method in lowercase
- `PATH` is a path on the server to handle
- `HANDLER` is the callback function to execute when the route is matched
  
### Routing requests

The following examples demonstrate creating simple endpoints for the GET, POST, PUT, PATCH and DELETE HTTP methods.

#### GET requests

```js
const express = require('express');

const port = 3000;
const app = express();

app.get('/', (req, res) => {
    res.send('GET');
});

app.get('/alternative', (req, res) => {
    res.send('The other GET');
});

const server = app.listen(port, () => {
    console.log(`Server up on ${server.address().address}:${port}`);
});
```

The example above demonstrates two available endpoints using the `HTTP GET` method, the first being the sites root (`http://localhost:3000/`) and the second having a different route (`http://localhost:3000/alternative`).

Sending requests with `curl` to these looks as follows:

```sh
Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl http://localhost:3000/
GET

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl http://localhost:3000/alternative
The other GET
```

Each endpoint returns a unique message.

#### Other request methods

```js
const express = require('express');

const port = 3000;
const app = express();

app.get('/', (req, res) => res.send('GET'));

app.get('/alternative', (req, res) => res.send('The other GET'))

app.post('/', (req, res) => res.send('POST'));

app.put('/', (req, res) => res.send('PUT'));

app.patch('/', (req, res) => res.send('PATCH'));

app.delete('/', (req, res) => res.send('DELETE'));

const server = app.listen(port, () => {
    console.log(`Server up on ${server.address().address}:${port}`);
});
```

As can be seen, each HTTP method has an associated method on the `express` object that can be called to register a route.

> Endpoints can share the same path as long as they have a different HTTP method.

The following examples demonstrate using `curl` to send requests to the different endpoints:

```sh
Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl http://localhost:3000/
GET

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl http://localhost:3000/ -X POST
POST

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl http://localhost:3000/ -X PUT
PUT

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl http://localhost:3000/ -X PATCH
PATCH

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl http://localhost:3000/ -X DELETE
DELETE
```

### Setting the response code

The response object has a method `status()` which can be used to set the status code of the response. By default, a `200` is applied to signify a HTTP OK response.

A HTTP Created (201) is used for signifying that a resource was created by a server, use the `.status()` method to change this. The following POST endpoint demonstrates this:

```js
app.post('/', (req, res) => res.status(201).send('POST'));
```

> The `status()` method is non-terminal, meaning if `send()` is not specified the request-response cycle will hang.

## URL and Query parameters

Often, we will want to submit data to a server as part of the API design of an endpoint. This could be the id of an entity, or even pagination numbers... URL and query parameters are not considered safe for transporting confidential or private information, or information which should be kept secure - the body of a HTTP message is more appropriate for this.

--------------------

### URL parameters

A **URL parameter** is data sent as part of the URL itself, for example a request might be sent to `http://localhost:3000/user/32` as a HTTP GET request to retrieve the `user` entity with the id of `32`.

Declare URL parameters in the path using a colon, `:`, followed by the name of the parameter. The parameter can then be accessed via the `req.params` object on the request object:

```js
app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    console.log(`READ BY ID: ${id}`);
    res.send(`READ USER: ${id}`);
});
```

### Query parameters

A **query parameter** acts similarly to a URL parameter, it is used for passing data to the server. The difference is that query parameters are specified at the end of the URL, after the path and any URL parameters. Query parameters always begin with a question mark, and take a `key=value` format with each parameter separated by an ampersand:

```js
app.get('/user', (req, res) => {
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const output = `Returning page ${page} consisting of ${pageSize} users`;
    console.log(output);
    res.send(output);
});
```

The query parameters passed through are accessed via the `req.query` object, these are automatically bound just like url parameters.

Sending a request to the above endpoint with `curl` would look like:

```sh
Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl "http://localhost:3000/user?page=3&pageSize=10"
Return 3 of 10 users
```

The first query parameter supplied is `page=3` indicating that the request wants page `3` of the results back using a `pageSize=10`, that is it returns 10 entities.

## Body data

When data is returned from an endpoint, we can easily return it in the format we want by specifying the `Content-Type` header and returning the relevant data as such. This is returned in the **HTTP Response Body**, an area of a HTTP message for transferring large amounts of data in a secure manner (when sent over HTTPS and secured from XSS vulnerabilities that is at the least). The following example demonstrates a typical Express function with a JSON response:

```js
const express = require('express');

const port = 3000;
const app = express();


const users = [{"id": 1, "name": "fred123"}, {"id": 2, "name": "fred234"}];

app.get('/user', (req, res) => {
    res.contentType('application/json')
        .status(200)
        .send(JSON.stringify(users));
});
```

On line 10, the correct media type is set for returning JSON as a header in the HTTP response, the status is accordingly set to 200 for a HTTP OK response code on line 11. Line 12 binds the `users` array as a JSON string to the HTTP response body.

### Accepting body data in a request

Body data doesn't just exist for HTTP responses, it can also be attached to HTTP requests sent to the server. The first thing to do to start accepting body data in the JSON format is to apply the built-in middleware in Express to handle this (middleware is explored in the next section).

```js
const express = require('express');

const port = 3000;
const app = express();


// use built-in json middleware
app.use(express.json());


const server = app.listen(port, () => {
    console.log(`Server up on ${server.address().address}:${port}`);
});
```

Line 8, `app.use(express.json())` adds the built-in middleware to the middleware stack, it must be added before any router bindings that require it as it is used for converting in-bound data into JSON format.

Once this is setup, lets add in some endpoints for reading an array of users (posing as a database of sorts):

```js
const express = require('express');

const port = 3000;
const app = express();

const users = [{"id": 1, "name": "fred123"}, {"id": 2, "name": "fred234"}];

function logger(req, res, next) {
    console.log(`${Date()} - ${req.method} ${req.path}`);
    next();
}

// no mount path, executed on every request to the router
app.use(logger);

app.get('/user', (req, res) => res.contentType('application/json').status(200).send(JSON.stringify(users)));

app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(user => user.id == id);
    if (user) {
        res.contentType('application/json').status(200).send(JSON.stringify(user));
        return;
    }
    res.contentType('text/plain').status(404).send(`User with id ${id} not found.`);
});

app.use(express.json());

const server = app.listen(port, () => {
    console.log(`Server up on ${server.address().address}:${port}`);
});
```

This example allows us to read all users or read one by their ID in JSON format:

```sh
Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl "http://localhost:3000/user"
[{"id":1,"name":"fred123"},{"id":2,"name":"fred234"}]

Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl "http://localhost:3000/user/2"
{"id":2,"name":"fred234"}
```

To allow requests to create users, a HTTP POST endpoint will be added that accesses JSON body data using `req.body`:

```js
app.post('/user', (req, res) => {
    const username = req.body.username;
    if (username) {
        const newUser = {id: idCounter++, username};
        users.push(newUser);
        return response(res, JSON.stringify(newUser));
    }
    response(res, `Bad request data.`, 400, 'text/plain');
});
```

The `response` function is a user-defined function created for the following complete example, also take note of how `name` has been changed to `username`:

```js
const express = require('express');

const port = 3000;
const app = express();


let idCounter = 3;
const users = [{id: 1, username: "fred123"}, {id: 2, username: "fred234"}];

function logger(req, res, next) {
    console.log(`${Date()} - ${req.method} ${req.path}`);
    next();
}

function response(res, data, status = 200, contentType = 'application/json') {
    res.contentType(contentType).status(status).send(data);
}

// no mount path, executed on every request to the router
app.use(logger);

app.get('/user', (req, res) => response(res, JSON.stringify(users)));

app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(user => user.id == id);
    if (user) {
        return response(res, JSON.stringify(user));
    }
    response(res, `User with id ${id} not found.`, 404, 'text/plain');
});

app.post('/user', (req, res) => {
    const username = req.body.username;
    if (username) {
        const newUser = {id: idCounter++, username};
        users.push(newUser);
        return response(res, JSON.stringify(newUser));
    }
    response(res, `Bad request data.`, 400, 'text/plain');
});

app.use(express.json());


const server = app.listen(port, () => {
    console.log(`Server up on ${server.address().address}:${port}`);
});
```

The important changes are:

- line 7: declares an idCounter variable
- line 15 - 17: auxilliary response() function created to simplify creating a http response
- line 33 - 41: defines the post functionality for the /user path, allowing a new user to be created using body data

To send a request to this API using `curl`, the content type of the request data must be set and the JSON supplied - Express handles converting the inbound JSON string into a JS object:

```sh
Morgan Walsh@DESKTOP-LT9E09K MINGW64 ~/test
$ curl 'http://localhost:3000/user' -X POST -H 'Content-Type: application/json' -d '{"username": "fred345"}'
{"id":3,"username":"fred345"}
```

## Response methods

Response methods exist on the response object, `res`, and are used to terminate the request-response cycle by sending a response to the client. If a route handler does not call a terminating method, the client request hangs:

- `res.download()`: Prompt a file to be downloaded
- `res.end()`: End the response process
- `res.json()`: Send a JSON response
- `res.redirect()`: Redirect a request
- `res.render()`: Render a view template
- `res.send()`: Send response of various types.
- `res.sendStatus()`: Set response status code and send string representation of it in the response body.

## Modular routes

Chainable route handlers can be created using `app.route()`, the path for a group of routes then only has to be specified once. For example:

```js
  app.route('/user')
    .get((req, res) => res.send('users'))
    .post((req, res) => res.send('new user'))
    .put((req, res) => res.send('user updated'))
    .delete((req, res) => res.send('user deleted'));
```

Each of the methods specified, chained as calls onto `route()`, will only apply for the `/user` route. This can aid in increasing maintainability and reducing typos.

## The Express Router

The `express.Router` class is used to create modular route handlers that can be mounted onto an Express app as middleware.

> A router is a self-contained middleware and routing system, it is a sub-system of the overall system.

The previous examples have tightly coupled the routing functionality to the creation of the server by being declared directly on the Express instance. The following examples will improve the design of the previous user example. First, create a file called `users.js` in an express project:

```js
const express = require('express');

const router = express.Router();

let idCounter = 3;
const users = [{id: 1, username: "fred123"}, {id: 2, username: "fred234"}];

function logger(req, res, next) {
    console.log(`${Date()} - ${req.method} ${req.path}`);
    next();
}

function response(res, data, status = 200, contentType = 'application/json') {
    res.contentType(contentType).status(status).send(data);
}

// no mount path, executed on every request to the router
router.use(logger);

router.get('/', (req, res) => response(res, JSON.stringify(users)));

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const user = users.find(user => user.id == id);
    if (user) {
        return response(res, JSON.stringify(user));
    }
    response(res, `User with id ${id} not found.`, 404, 'text/plain');
});

router.post('/', (req, res) => {
    const username = req.body.username;
    if (username) {
        const newUser = {id: idCounter++, username};
        users.push(newUser);
        return response(res, JSON.stringify(newUser));
    }
    response(res, `Bad request data.`, 400, 'text/plain');
});

router.delete('/:id', (req, res) => {
    const user = users.find(user => user.id == req.params.id);
    const index = users.indexOf(user);

    if (index > -1) {
        users.splice(index, 1);
        delete user.id;
        return response(res, JSON.stringify(user));
    }
    response(res, `User with id ${id} not found.`, 404, 'text/plain');
});

module.exports = router;
```

This creates an instance of `Router` on line 3, then `router.use()` and `router.METHOD()` methods are used to register endpoints. The `router` object is then exported on line 53.

Then, load the new router module in the express app to use it:

```js
const express = require('express');
const userRouter = require('./app/users');

const port = 3000;
const app = express();

app.use(express.json());
app.use('/user', userRouter);

const server = app.listen(port, () => {
    console.log(`Server up on ${server.address().address}:${port}`);
});
```

Line 2 imports the user router, line 8 then adds the router to the middleware stack, binding to the `'/user'` path.

</div>