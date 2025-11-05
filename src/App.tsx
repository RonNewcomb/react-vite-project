import "./App.css";
import { A } from "./components/A";
import { B } from "./components/B";
import { C } from "./components/C";
import { Loading } from "./components/Loading";
import { Params } from "./components/Params";
import "./services/router";
import { goto, type Route, Router } from "./services/router";
import reactLogo from "/assets/react.svg";
import viteLogo from "/assets/vite.svg";

const wait = (ms?: number) => new Promise(r => setTimeout(r, ms || 1000));

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
  {
    path: "/lazy",
    component: () =>
      wait()
        .then(() => import("./components/D"))
        .then(({ D }) => <D />),
  },
  {
    path: "raw",
    component: () =>
      import("./components/D.tsx").then(module => {
        //console.log(module[Symbol.toStringTag], module[Symbol.toStringTag] === "Module");
        return (module["D"] || module.default)();
      }),
  },
  {
    path: "veryraw",
    component: () => import("./components/D.tsx"),
    //   .then(module => {
    //   //console.log(module[Symbol.toStringTag], module[Symbol.toStringTag] === "Module");
    //   return (module["D"] || module.default)();
    // }),
  },
  { path: "parameters/:id", component: ({ id }) => <div>Params {id}</div> },
  // { path: "parameters/:id/:otherId", component: Params },
  { path: "parameters/:id/:otherId", component: props => <Params {...props} /> },

  {
    path: "customer",
    component: () => (
      <Router
        routes={[
          { path: "/", component: () => <A /> },
          { path: ":id", component: ({ id }) => <div>Customer #{id}</div> },
          {
            path: "list",
            component: async () => {
              const x = await wait(2000);
              return <C anything={x} />;
            },
          },
        ]}
      ></Router>
    ),
  },
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
        <button onClick={() => goto("/home?arg=72")}>A</button>
        <button onClick={() => goto("/home/dash")}>B</button>
        <button onClick={() => goto("/home/dashboard")}>C</button>
        <button onClick={() => goto("/lazy")}>lazy D</button>
        <button onClick={() => goto("/raw")}>raw D</button>
        <button onClick={() => goto("/invalid")}>invalid</button>
        <button onClick={() => goto("parameters/42?arg=2")}>With Param 42</button>
        <button onClick={() => goto("parameters/5/foo")}>With Param 5 "foo"</button>
      </div>
      <Router routes={routes}>
        <Loading />
      </Router>
    </main>
  );
}
