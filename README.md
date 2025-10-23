# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR.

`npm run dev`

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## useStateAsync

This contains a fantastic implementation of `useStateAsync` for data fetching!

- One single, clean line: `const [invoice, loading, error, refresh] = useStateAsync(getInvoice, [id]);`
- Dependency array is required! No more accidental omission problems!
- No `useEffect`!
- Safe for `<StrictMode />`! No more double-fetch + cancel!
- Accepts _any_ async function, not just `fetch` functions!
- Accepts plain ol' javascript functions! Create data services outside of React!
- Returns a tuple for easy naming just like `useState`! No more rambling `{ data: invoice, loading: invoiceLoading, error: invoiceError }` with multiple line breaks!
- Payload automatically infers its type from your async function!
- Provides `refresh()` function for imperative re-loads from handlers for `onClick`, `onSubmit`, etc!
- `refresh()` _also_ returns the new `Promise` for your use!
- Invoke `refresh('silently')` to avoid immediate re-render! (You can skip setting isLoading to true!) Great for background loads!
- Automatically passes the depArray to your function for simplicity! No need for wrappers like `useStateAsync(() => getOrders(id, userId), [id, userId])`, you just write `useStateAsync(getOrders, [id, userId])` and of course your function can use those values!
- Accepts an input tuple for initial values! `useStateAsync([getSettings, { darkMode: 'system' }, false], [userId])`
- Skip fetches with easy conditionals! `useStateAsync(!pause && getNotifications, [userId])`
- Less than 100 lines of code!
- No external dependencies!
