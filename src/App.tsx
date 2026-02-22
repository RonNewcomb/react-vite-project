import "./App.css";
import { A } from "./components/A";
import { B } from "./components/B";
import { C } from "./components/C";
import { Loading } from "./components/Loading";
import { Params } from "./components/Params";
import "./services/router";
import { goto, type Route, Router } from "./services/router";

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
    path: "/lazywait",
    component: () =>
      wait()
        .then(() => import("./components/D"))
        .then(({ D }) => <D />),
  },
  {
    path: "/lazy",
    component: props => import("./components/D").then(Module => <Module.default {...props} />),
  },
  {
    path: "/lazy1",
    component: () => import("./components/D").then(({ D }) => <D />),
  },
  {
    path: "/lazy2",
    component: props => import("./components/D").then(Module => <Module.D {...props} />),
  },
  {
    path: "default/:id",
    component: props => import("./components/D").then(Module => <Module.default {...props} />),
  },
  {
    path: "default2/:cid",
    component: ({ cid }) => import("./components/D").then(Module => <Module.default id={cid} />),
  },
  {
    path: "default3/:id",
    component: ({ id }) => import("./components/D").then(({ default: D }) => <D id={id} />),
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
      <p className="read-the-docs">Read the docs</p>
      <div>
        <button onClick={() => goto("/home?arg=72")}>A</button>
        <button onClick={() => goto("/home/dash")}>B</button>
        <button onClick={() => goto("/home/dashboard")}>C</button>
        <button onClick={() => goto("/lazy")}>lazy D</button>
        <button onClick={() => goto("/raw")}>raw D</button>
        <button onClick={() => goto("/default/47")}>D 47</button>
        <button onClick={() => goto("/invalid")}>invalid</button>
        <button onClick={() => goto("parameters/42?arg=2")}>With Param 42</button>
        <button onClick={() => goto("parameters/5/foo")}>With Param 5 "foo"</button>
      </div>
      <Router routes={routes} loading={<Loading />} />
    </main>
  );
}
