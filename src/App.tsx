import "./App.css";
import { A } from "./components/A";
import { B } from "./components/B";
import { C } from "./components/C";
import { Loading } from "./components/Loading";
import { Params } from "./components/Params";
import "./services/router";
import { type Route, Router, goto } from "./services/router";
import reactLogo from "/assets/react.svg";
import viteLogo from "/assets/vite.svg";

const wait = (ms: number) => new Promise(r => setTimeout(r, ms || 1000));

//////////////

const routes: Route[] = [
  { path: "/", component: () => <div>Hello!</div> },
  { path: "home", component: () => <A /> },
  { path: "home/dash", component: B },
  {
    path: "home/dashboard",
    component: async () => {
      const x = await wait(2000);
      return <C anything={x} />;
    },
  },
  { path: "/lazy", component: () => import("./components/D").then(({ D }) => <D />) },
  { path: "lazy2", component: () => import("./components/D").then(module => module["D"]()) },
  { path: "parameters/:id", component: ({ id }) => <div>Params {id}</div> },
  // { path: "parameters/:id/:otherId", component: Params },
  { path: "parameters/:id/:otherId", component: props => <Params {...props} /> },
];

///////////////

export function App() {
  return (
    <main className="centeredcolumn">
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
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">{"Click on the Vite and React logos to learn more"}</p>
      <div>
        <button onClick={() => goto("/home")}>A</button>
        <button onClick={() => goto("/home/dash")}>B</button>
        <button onClick={() => goto("/home/dashboard")}>C</button>
        <button onClick={() => goto("/lazy")}>lazy D</button>
        <button onClick={() => goto("/invalid")}>invalid</button>
        <button onClick={() => goto("parameters/42")}>With Param 42</button>
        <button onClick={() => goto("parameters/5/foo")}>With Param 5 "foo"</button>
      </div>
      <Router routes={routes}>
        <Loading />
      </Router>
    </main>
  );
}
