import { startTransition, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useStateAsync } from "./useStateAsync";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// SAMPLE use axios or something
const fetcher = <T,>(...args: Parameters<typeof fetch>) =>
  fetch(...args)
    .then(() => wait(Math.random() * 2000))
    .then<T>(() => new Date().toLocaleTimeString() as T);

// SAMPLE
type Customer = {};
type Order = {};
type Invoice = {};

export function App() {
  const [count, setCount] = useState(1);
  const [payload, loading, error, refresh, promise] = useStateAsync(() => fetcher<Customer>(`/customers/${count}`), [count]);

  useEffect(() => {
    promise.then(x => console.log("chained off of promise", x));
    return () => console.log("Somehow un-chain");
  }, [promise]);

  const [payload2, loading2, error2, refresh2] = useStateAsync(count % 3 && (() => fetcher<Order>(`/orders/${count}`)), [count]);
  const [payload3, loading3, error3, refresh3] = useStateAsync(
    [count && (() => fetcher<Invoice>(`/invoices/${count}`).then(_ => ({ count: count.toString() }))), { count: "bar" }, false],
    [count]
  );

  const [cls, setCls] = useState("read-the-docs");

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={cls} onClick={() => setCls(cls ? "" : "read-the-docs")}>
        Click on the Vite and React logos to learn more
      </p>
      {loading && <div>Loading...</div>}
      {error && <div className="err">Error: {JSON.stringify(error)}</div>}
      {payload && <div>Payload: {JSON.stringify(payload)}</div>}
      <button onClick={refresh}>refresh</button>

      {loading2 && <div>2Loading...</div>}
      {error2 && <div className="err">2Error: {JSON.stringify(error2)}</div>}
      {payload2 && <div>2Payload: {JSON.stringify(payload2)}</div>}
      <button onClick={refresh2}>2refresh</button>

      {loading3 && <div>3Loading...</div>}
      {error3 && <div className="err">3Error: {JSON.stringify(error3)}</div>}
      {payload3 && <div>3Payload: {JSON.stringify(payload3)}</div>}
      <button onClick={refresh3}>3refresh</button>
    </>
  );
}

export function TabContainer() {
  const [tab, setTab] = useState("about");
  const selectTab = (t: typeof tab) => startTransition(() => setTab(t));

  return <div onClick={() => selectTab("about")}></div>;
}
