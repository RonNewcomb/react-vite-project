# Router

### Observations

The `Router` is just a component, not a separate entity that magically talks to a "router-outlet".

The nav function, `goto`, is outside the Router component. Import it like any javascript function. It uses browser-native events to talk to the component.

Nested routes are fine but nested routers? I don't think that's necessary unless the router is effectively a tabset with invisible tabs.

#### TODO

Nested routers. Nested routes.

Async function "C" needs to check if its stale after the promise returns.

Trying to avoid useEffect so it's synchronous unless there really is a Promise. And even if there's a promise is it already resolved.

Animations.

Parameters.

Getting the resulting Promise from the `import(...)` we can tell it from a normal async component:

```typescript
import("./components/D").then(module => {
    console.log(module[Symbol.toStringTag]);
    console.log(module[Symbol.toStringTag] === "Module");
    return module["D"]();
}),
```

### Discarded Features

Can't just have the `component:` be a string for dynamic `import()` because the bundler cannot fix the path.

Also, routes definition just being a key-value object was messier than expected when using deep routes with parameters. Too much punctuation.

### Break it out into pieces

1. the url reader and changer, the `goto` function. Relative goto.
1. the tabset-without-tabstrip.
1. the component loader, data loader, and promise problems
1. the isloading screen for unresolved promise phase.
1. the animation interstitial phase.
1. the route config that connects URL to Component , whose `goto` changes "tab"
1. the exiting tab panel to be kept until animation finishes.
1. the router config is always partial; parts are lazy-loaded and added at runtime

When the `goto` aims to a level deeper than the router config... there's another router?

When gotoing a path with ?query params but the same path we're already on, do we still nav? I guess so....
