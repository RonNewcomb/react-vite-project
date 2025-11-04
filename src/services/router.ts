import { useCallback, useMemo, useState, type JSX, type PropsWithChildren, type ReactNode } from "react";

export interface ReactComponent {
  (props: any & object): JSX.Element | Promise<JSX.Element>;
}

export interface Route {
  path: string;
  component: ReactComponent;
}

export class NavEvent extends Event {
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

const cleanPath = (path: string) => path.split("/").filter(x => !!x);

export function Router({ routes, children }: PropsWithChildren<{ routes: Route[] }>) {
  const [current, setCurrent] = useState(() => cleanPath(location.pathname));
  const handler = useCallback((ev: NavEvent) => setCurrent(cleanPath(ev.to)), []);

  const cleanRoutes = useMemo<CleanRoute[]>(() => {
    document.body.removeEventListener("nav-event", handler as any);
    document.body.addEventListener("nav-event", handler as any);

    return routes
      .map<CleanRoute>(({ path, component }) => ({
        component,
        path: cleanPath(new URL(path.replace(/\/\//g, "/"), "http://localhost").pathname),
      }))
      .sort((a, b) => a.path.length - b.path.length); // shortest path first
  }, []);

  // console.log(cleanRoutes.map(r => r.path.join("/")), current);

  const options: CleanRoute[] = cleanRoutes
    .filter(r => current.length == r.path.length)
    .filter(r => current.every((h, i) => h == r.path[i] || r.path[i].startsWith(":")));

  if (options.length !== 1) {
    const num = options.length ? "Multiple" : "No";
    const msg = "route definitions for /" + current.join("/");
    console.error(num, msg);
    options.map(o => console.error("#" + cleanRoutes.indexOf(o) + "  /" + o.path.join("/")));
  }

  const chosenRoute = options?.[0];
  const comp = chosenRoute?.component;

  const renderedNodeOrAPromise = useMemo(() => {
    //console.log("Calling Comp()");
    if (!comp) return undefined;
    window.history.pushState("", "", "/" + current.join("/"));

    const props = current.reduce(
      (sum, each, i) => {
        const segment = chosenRoute.path[i];
        const name = segment.startsWith(":") ? segment.slice(1) : undefined;
        if (name) sum[name] = each;
        return sum;
      },
      {} as Record<string, string | number>
    );
    return comp(props);
  }, [comp]);

  const [component, setComponent] = useState<ReactNode | null>(null);

  const synchronousFallback = useMemo(() => {
    if (!renderedNodeOrAPromise) return component;
    if (!(renderedNodeOrAPromise instanceof Promise)) {
      //console.log("is component. setting and returning ");
      setComponent(renderedNodeOrAPromise); // unnecessary?
      return renderedNodeOrAPromise;
    }
    //console.log("Promise. returning Children and wait");
    setComponent(null);
    renderedNodeOrAPromise.then(setComponent);
    // return component; // if you want the previous screen to stay put
    return children;
  }, [renderedNodeOrAPromise, component]);

  return component ?? synchronousFallback ?? children;
}
