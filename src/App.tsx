import { startTransition, useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useStateAsync } from "./useStateAsync";

export function App() {
  const [count, setCount] = useState(0);
  const [payload, loading, error, refresh, promise] = useStateAsync(() => fetch(`/customers/${count}`), [count]);

  useMemo(() => promise.then(x => console.log("returned", x)), [promise]);

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
      {error && <div>Error: {JSON.stringify(error)}</div>}
      {payload && <div>Payload: {JSON.stringify(payload)}</div>}
      <button onClick={refresh}>refresh</button>
    </>
  );
}

export function TabContainer() {
  const [tab, setTab] = useState("about");
  const selectTab = (t: typeof tab) => startTransition(() => setTab(t));

  return <div></div>;
}
