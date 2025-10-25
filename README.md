# useStateAsync

This contains a fantastic implementation of `useStateAsync` for data fetching!

- One single, clean line:
  `const [invoice, loading, error, refresh] = useStateAsync(getInvoice, [id]);`
- No more `useEffect`!
- Dependency array always! No more accidents!
- Safe for `<StrictMode />`!
- Accepts _any_ async function, not just `fetch` functions!
- Accepts plain ol' javascript functions! Roll your own data services outside of React!
- Returns a tuple for easy unique naming!
- Payload automatically infers its type from your async function!
- Provides `refresh()` to reload from click handlers!
- `refresh()` _also_ returns the new `Promise` for you!
- Avoid re-renders with `refresh('silently')`! Skip the `isLoading=true` for background loading!
- Automatically passes the hook's dependencies to your function!
- Provide initial input values!
- Skip fetches with easy conditionals! `useStateAsync(!paused && getNotifications, [userId])`
- Less than 100 lines of code!
- No external dependencies!

## Details

Designed to work with `<StrictMode />`. No more double-fetch, no more cancel into re-fetch.

Returns a tuple for easy naming just like `useState`. No more rambling renames like
`const { data: invoice, loading: invoiceLoading, error: invoiceError } = `
with multiple line breaks.

Your function is called with the depArray arguments. No need for wrappers like
`useStateAsync(() => getOrders(id, userId), [id, userId])`
You just write
`useStateAsync(getOrders, [id, userId])`

Provide initial input values with an input tuple.
`const [settings, loading] = useStateAsync([getSettings, { darkMode: 'system' }, false], [userId])`

Skip fetches with easy conditionals. `useStateAsync(!pause && getNotifications, [userId])`

### React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR.

`npm run dev`

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
