# State with React hooks

In React, we often want to create dynamic components where the data inside them could change. Using props, we cannot do this unless we re-render the whole component manually. React components have a built-in `state` object for managing data that is subject to change, when this object changes the component will be re-rendered.

## Adding state to a component

Hooks were added to React in version 16.8, these allow function components to access their state and lifecycle.

> Class components are generally not needed anymore due to this.

There are multiple hooks available in React that can be imported from `react`:

- `useState()`
- `useEffect()`
- `useContext()`
- `useRef()`
- `useMemo()`

There are 3 rules with React hooks:

1. Hooks can only be called inside function components
2. Hooks can only be called at the top level of a component
3. Hooks cannot be conditional

The `useState` hook is for tracking state in a function component, the data that is subject to change.

The first step is to import the `useState` hook:

```js
import { useState } from 'react';
```

Once we have imported the function, we can initialise state in components using it. `useState` accepts the initial state and returns two values:

1. The current state
2. A function for updating said state

```js
const UserEditForm = (props) => {

    const [age, setAge] = useState(props.age);

    return (
        <form>
        <h3>{props.user.username} | Edit profile</h3>
        {/*
            The input is data that changes during the lifecycle of the component, this represents state and will be explored in a different article.
            ,*/}
            <label htmlFor="age">Age: </label>
            <input type="number"
                id="age"
                defaultValue={age} />
        </form>
    );
}
```

Once the state is initialised, it can be used anywhere in the component.

## Updating state

To update state, we must not access the variable directly. Instead, we should use the mutator function provided by the `useState` hook.

```js
  const UserEditForm = (props) => {

    const [age, setAge] = useState(props.user.age);

    const updateAge = (event) => setAge(event.target.value);

    return (
      <form>
        <h3>{props.user.username} | Edit profile</h3>
        {/*
           The input is data that changes during the lifecycle of the component, this represents state and will be explored in a different article.
         ,*/}
         <label htmlFor="age">Age: </label>
         <input type="number"
                id="age"
                defaultValue={age}
                onChange={this.updateAge} />
       </form>
    );
  }
```

If we then pass a prop named `user`, with the username and age properties, to the component - `<UserEditForm user={user} />` - it will render a form for us
with the ability to modify the value of age. Given the following object:

```js
const user = {
    username: "Fred",
    age: 32
};
```

was passed as a prop to the edit form component, it would render the following HTML:

```html
<form>
    <h3>Fred | Edit profile</h3>
    <label for="age">Age:</label>
    <input type="number" id="age" value="32" />
</form>
```

Using ReactDOMServer to render JSX as static markup:

```js
const React = require('react');
const useState = React.useState;
const ReactDOMServer = require('react-dom/server');
const renderToStaticMarkup = ReactDOMServer.renderToStaticMarkup;
const beautify = require('simply-beautiful');

const UserEditForm = (props) => {

    const [age, setAge] = useState(props.user.age);

    const updateAge = (event) => setAge(event.target.value);

    return (
      <form>
        <h3>{props.user.username} | Edit profile</h3>
        {/*
           The input is data that changes during the lifecycle of the component, this represents state and will be explored in a different article.
         ,*/}
         <label htmlFor="age">Age: </label>
         <input type="number"
                id="age"
                defaultValue={age}
                onChange={this.updateAge} />
       </form>
    );
}

const user = {
    username: "Fred",
    age: 32
};
let markup = renderToStaticMarkup(<UserEditForm user={user} />);
console.log(beautify.html(markup));
```
