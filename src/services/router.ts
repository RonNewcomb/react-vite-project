import { useCallback, useMemo, useRef, useState, type JSX, type PropsWithChildren, type ReactNode } from "react";

export interface ReactComponent {
  (props: any & object): JSX.Element | Promise<JSX.Element>;
}

export interface Route {
  path: string;
  component: ReactComponent | { [Symbol.toStringTag]: "Module" };
}

interface CleanRoute {
  path: string[];
  component: ReactComponent;
}

// goto URL /////
export const NavEventType = "nav-event";

export class NavEvent extends Event {
  to: string = "";
}

const attach = (handler: (ev: NavEvent) => void) => document.body.addEventListener(NavEventType, handler as any);
const detach = (handler: (ev: NavEvent) => void) => document.body.removeEventListener(NavEventType, handler as any);
const setBrowserUrl = (url: string | URL, data?: any) => window.history.pushState(data, "", url);

export async function goto(path: string) {
  const event = new NavEvent(NavEventType);
  event.to = path;
  document.body.dispatchEvent(event);
}

// clean input
const pathToUrl = (path: string) => new URL(path.replace(/\/\//g, "/"), location.origin);

// clean input
const onlyTheCleanPath = (path: string) =>
  pathToUrl(path)
    .pathname.split("/")
    .filter(x => !!x);

// clean user input // sort shortest path first
const cleanTheRoutes = (routes: Route[]) =>
  routes.map<CleanRoute>(({ path, component }) => ({ component, path: onlyTheCleanPath(path) })).sort((a, b) => a.path.length - b.path.length);

/**
 * find matching component
 */
function findMatchingComponent(routes: CleanRoute[], path: string): JSX.Element | Promise<JSX.Element> | undefined {
  const current = onlyTheCleanPath(path);

  const matchedRoutes = routes.filter(r => current.length == r.path.length).filter(r => current.every((h, i) => h == r.path[i] || r.path[i].startsWith(":")));
  if (matchedRoutes.length !== 1) {
    const num = matchedRoutes.length ? "Multiple" : "No";
    const msg = "route definitions for /" + current.join("/");
    console.error(num, msg);
    matchedRoutes.map(o => console.error("#" + routes.indexOf(o) + "  /" + o.path.join("/")));
  }

  const route = matchedRoutes[0];
  if (!route?.component) return undefined;

  const props: Record<string, string | number> = {};
  for (let i = 0; i < current.length; i++) {
    const routeSegment = route.path[i];
    if (routeSegment.startsWith(":")) props[routeSegment.slice(1)] = current[i];
  }

  setBrowserUrl(pathToUrl(path));
  return route.component(props);
}

/**
 * Router
 */
export function Router({ routes, children: loading, unknown: unknownRoute }: PropsWithChildren<{ routes: Route[]; unknown?: JSX.Element }>) {
  const cleanRoutes = useMemo<CleanRoute[]>(() => cleanTheRoutes(routes), []);

  const [promiseOrNode, setPromiseOrNode] = useState(() => findMatchingComponent(cleanRoutes, location.pathname));

  const handler = useCallback((ev: NavEvent) => {
    const component = findMatchingComponent(cleanRoutes, ev.to);
    if (component) setPromiseOrNode(component);
  }, []);

  useMemo(() => {
    detach(handler);
    attach(handler);
  }, []);

  const [_, rerender] = useState<ReactNode | null>(null); // useRef gives me control of re-render
  const resolvedComponent = useRef<ReactNode | null>(null);

  const synchronousFallback = useMemo(() => {
    if (!promiseOrNode) return unknownRoute;
    const isPromise = promiseOrNode instanceof Promise;
    if (isPromise) promiseOrNode.then(el => rerender((resolvedComponent.current = el)));
    return (resolvedComponent.current = isPromise ? loading : promiseOrNode);
  }, [promiseOrNode]);

  return resolvedComponent.current ?? synchronousFallback;
}
