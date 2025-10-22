import { startTransition, useState } from "react";
import "./App.css";
import { useStateAsync } from "./hooks/useStateAsync";
import type { Customer, Invoice, Order } from "./interfaces";
import { fetcher } from "./utils/fetcher";
import reactLogo from "/assets/react.svg";
import viteLogo from "/assets/vite.svg";

export interface AppProps {
  initialCount?: number;
}

export function App({ initialCount = 1 }: AppProps) {
  const [count, setCount] = useState(initialCount);
  const [payload, loading, error, refresh] = useStateAsync(() => fetcher<Customer>(`/customers/${count}`), [count]);
  const [payload2, loading2, error2, refresh2] = useStateAsync(count % 3 && (() => fetcher<Order>(`/orders/${count}`)), [count]);
  const [payload3, loading3, error3, refresh3] = useStateAsync(
    [count && (() => fetcher<Invoice>(`/invoices/${count}`).then(_ => ({ count: count.toString() }))), { count: "bar" }, false],
    [count]
  );
  // const [payload4, loading4, error4, refresh4] = useStateAsync(
  //   old => {
  //     console.log("old", old);
  //     return fetcher<Order>(`/summary/${count}`);
  //   },
  //   [count]
  // );

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

      <div>
        <img src={reactLogo} className="spin" alt="Loading..." width={16} style={{ visibility: loading ? "visible" : "hidden" }} />
        {!!error && <span className="err">Error: {JSON.stringify(error)}</span>}
        {payload && <span>Payload: {JSON.stringify(payload)}</span>}
      </div>
      <button onClick={refresh}>refresh</button>

      <div>
        <img src={reactLogo} className="spin" alt="Loading..." width={16} style={{ visibility: loading2 ? "visible" : "hidden" }} />
        {!!error2 && <span className="err">2Error: {JSON.stringify(error2)}</span>}
        {payload2 && <span>2Payload: {JSON.stringify(payload2)}</span>}
      </div>
      <button onClick={refresh2}>2refresh</button>

      <div>
        <img src={reactLogo} className="spin" alt="Loading..." width={16} style={{ visibility: loading3 ? "visible" : "hidden" }} />
        {!!error3 && <span className="err">3Error: {JSON.stringify(error3)}</span>}
        {payload3 && <span>3Payload: {JSON.stringify(payload3)}</span>}
      </div>
      <button onClick={refresh3}>3refresh</button>
    </>
  );
}

export function TabContainer() {
  const [tab, setTab] = useState("about");
  const selectTab = (t: typeof tab) => startTransition(() => setTab(t));

  return <div onClick={() => selectTab("about")}></div>;
}
