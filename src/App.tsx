import { startTransition, useState } from "react";
import "./App.css";
import { Child } from "./components/Child";
import { useAsync } from "./hooks/useAsync";
import type { Customer, Order } from "./interfaces";
import { getInvoice } from "./models/Invoice";
import { fetcher } from "./utils/fetcher";
import reactLogo from "/assets/react.svg";
import viteLogo from "/assets/vite.svg";

export interface AppProps {
  initialCount?: number;
}

export function App({ initialCount = 1 }: AppProps) {
  console.log("APP rerender");
  const [count, setCount] = useState(initialCount);
  const id = count;

  const enabled2 = count % 3;
  const enabled3 = count != initialCount;
  const enabled4 = count % 4;

  const [payload1, loading1, error1, refresh1] = useAsync(() => fetcher<Customer>(`/customers/${id}`), [id]);
  const [payload2, loading2, error2, refresh2] = useAsync(enabled2 && (() => fetcher<Order>(`/orders/${id}`)), [id]);
  const [payload3, loading3, error3, refresh3] = useAsync([enabled3 && getInvoice, { count: "bar" }, true, "Cannot use Initial Count"], [count]);
  const [payload4, loading4, error4, refresh4] = useAsync<Order>(
    enabled4 &&
      (old => {
        console.log("old", old, "but new ", count);
        return fetcher<Order>(`/summary/${count}`);
      }),
    [count]
  );

  // typical usage
  //const [invoice, loadingInvoice, invoiceError] = useAsync(getInvoice, [id]);

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

      <Child id={4} />

      <div>
        <img src={reactLogo} className="spin" alt="Loading..." width={16} style={{ visibility: loading1 ? "visible" : "hidden" }} />
        {payload1 && <span>Payload1: {JSON.stringify(payload1)}</span>}
        {!!error1 && <span className="err">Error1: {JSON.stringify(error1)}</span>}
      </div>
      <button onClick={refresh1}>Refresh1</button>

      <div>
        <img src={reactLogo} className="spin" alt="Loading..." width={16} style={{ visibility: loading2 ? "visible" : "hidden" }} />
        {payload2 && <span>Payload2: {JSON.stringify(payload2)}</span>}
        {!!error2 && <span className="err">Error2: {JSON.stringify(error2)}</span>}
      </div>
      <button onClick={refresh2} disabled={!enabled2}>
        Refresh2
      </button>

      <div>
        <img src={reactLogo} className="spin" alt="Loading..." width={16} style={{ visibility: loading3 ? "visible" : "hidden" }} />
        {payload3 && <span>Payload3: {JSON.stringify(payload3)}</span>}
        {!!error3 && <span className="err">Error3: {JSON.stringify(error3)}</span>}
      </div>
      <button onClick={refresh3} disabled={!enabled3}>
        Refresh3
      </button>

      <div>
        <img src={reactLogo} className="spin" alt="Loading..." width={16} style={{ visibility: loading4 ? "visible" : "hidden" }} />
        {payload4 && <span>Payload4: {JSON.stringify(payload4)}</span>}
        {!!error4 && <span className="err">Error4: {JSON.stringify(error4)}</span>}
      </div>
      <button onClick={() => refresh4("silent")} disabled={!enabled4}>
        Refresh4
      </button>
    </>
  );
}

export function TabContainer() {
  const [tab, setTab] = useState("about");
  const selectTab = (t: typeof tab) => startTransition(() => setTab(t));

  return <div onClick={() => selectTab("about")}></div>;
}
