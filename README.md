# Router

### Observations

The `Router` is just a component, not a separate entity that magically talks to a "router-outlet".

The nav function, `goto`, is outside the Router component. Import it like any javascript function. It uses browser-native events to talk to the component.

#### TODO

Nested routers. Nested routes.

Async function "C" needs to check if its stale after the promise returns.

Parameters.

### Discarded Features

Can't just have the `component:` be a string for dynamic `import()` because the bundler cannot fix the path.

Also, getting the resulting Promise from the `import` I can't tell it from a normal async component so don't know if it needs unwrapping. Default export maybe works?

Also, routes definition just being a key-value object was messier than expected when using deep routes with parameters. Too much punctuation.
