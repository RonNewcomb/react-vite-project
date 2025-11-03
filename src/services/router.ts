import { ReactNode, useCallback, useMemo, useState, type JSX, type PropsWithChildren } from "react";

export interface ReactComponent {
  (): JSX.Element | Promise<JSX.Element>;
}

export interface Route {
  path: string;
  component: ReactComponent;
}

class NavEvent extends Event {
  to: string = "";
}

export async function goto(path: string) {
  const ev = new NavEvent("nav-event");
  ev.to = path;
  document.body.dispatchEvent(ev);
}

interface CleanRoute {
  path: string[];
  component: ReactComponent;
}

export function Router({ routes, children }: PropsWithChildren<{ routes: Route[] }>) {
  const [current, setCurrent] = useState(location.pathname);
  const handler = useCallback((e: NavEvent) => setCurrent(e.to), []);

  const rs = useMemo<CleanRoute[]>(() => {
    document.body.addEventListener("nav-event", handler as any);

    return routes
      .map(({ path, component }) => {
        const cleanRoute: CleanRoute = {
          path: new URL(path.replace(/\/\//g, "/"), "http://localhost").pathname.split("/").filter(x => !!x),
          component,
        };
        return cleanRoute;
      })
      .sort((a, b) => a.path.length - b.path.length); // shortest path first
  }, []);

  console.log(
    rs.map(r => r.path.join("/")),
    current
  );

  const here = current.split("/").filter(x => !!x);
  const options: CleanRoute[] = rs.filter(r => here.length == r.path.length && here.every((h, i) => h == r.path[i]));

  if (options.length !== 1) console.error((!options.length ? "No" : "Multiple") + " route definitions for /" + here.join("/"));

  const comp = options?.[0]?.component;

  const renderedNodeOrAPromise = useMemo(() => {
    console.log("Calling Comp()");
    if (!comp) return undefined;
    window.history.pushState("", "", current);
    return comp();
  }, [comp]);

  const [component, setComponent] = useState<ReactNode | null>(null);

  const synchronousFallback = useMemo(() => {
    if (!renderedNodeOrAPromise) return component;
    if (!(renderedNodeOrAPromise instanceof Promise)) {
      console.log("is component. setting and returning ");
      setComponent(renderedNodeOrAPromise); // unnecessary?
      return renderedNodeOrAPromise;
    }
    console.log("Promise. returning Children and wait");
    //setComponent(null);
    renderedNodeOrAPromise.then(renNode => {
      // TODO check to see if it's still current
      setComponent(renNode);
      console.log("Returned!");
    });
    return component;
  }, [renderedNodeOrAPromise]);

  return component ?? synchronousFallback ?? children;
}
