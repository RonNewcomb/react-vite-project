import { ReactNode, useMemo, useRef, useState, type JSX } from "react";

export interface ReactComponent {
  (props: any & object): JSX.Element | Promise<JSX.Element>;
}

export interface Route {
  path: string;
  //loading?: ReactComponent;
  //if?: () => boolean;
  component: ReactComponent;
  //else?: ReactComponent;
}

interface CleanRoute extends Route {
  segments: string[];
}

// goto URL /////

export class NavEvent extends Event {
  static Type = "nav-event";
  static Target = document.body;
  to: string;
  constructor(to: string) {
    super(NavEvent.Type);
    this.to = to;
    // console.log("Going to ", to);
  }
}

export const goto = (path: string) => NavEvent.Target.dispatchEvent(new NavEvent(path));

export function useGlobalNavigationEvent(handler: (evt: NavEvent) => void, depArray: any[]) {
  useMemo(() => {
    NavEvent.Target.removeEventListener(NavEvent.Type, handler as EventListener);
    NavEvent.Target.addEventListener(NavEvent.Type, handler as EventListener);
  }, depArray || []);
}

// clean utils /////////

const pathToUrl = (path: string) => new URL(path.replace(/\/\//g, "/"), location.origin);

const onlyTheCleanPath = (path: string) =>
  pathToUrl(path)
    .pathname.split("/")
    .filter(x => !!x);

// find matching component //////

function findComponent(routes: CleanRoute[], path: string): JSX.Element | Promise<JSX.Element> | undefined {
  const current = onlyTheCleanPath(path);

  const matchedRoutes = routes.filter(r => current.length == r.segments.length && current.every((c, i) => c == r.segments[i] || r.segments[i].startsWith(":")));
  if (matchedRoutes.length !== 1) {
    console.error(matchedRoutes.length ? "Multiple" : "No", "route definitions for /" + current.join("/"));
    matchedRoutes.map(o => console.error("#" + routes.indexOf(o) + "  /" + o.segments.join("/")));
  }

  const route = matchedRoutes[0];
  if (!route?.component) return undefined;

  const props: Record<string, string | number> = {};
  for (let i = 0; i < current.length; i++) {
    const routeSegment = route.segments[i];
    if (routeSegment.startsWith(":")) props[routeSegment.slice(1)] = current[i];
  }

  window.history.pushState(undefined, "", pathToUrl(path)); // setBrowserUrl
  return route.component(props); // lazy loading will be a promise; cache on resolve to make synchronous?
}

/**
 * like useState with 3rd option for a setSilent
 * @returns [current value, set-and-rerender, set-without-rerender]
 */
export function useStateSilently<T>(init: T): [T, (node: T) => void, (n: T) => T] {
  const [_, rerender] = useState<T>(init);
  const container = useRef<T>(init);
  return [container.current, (n: T) => rerender((container.current = n)), (n: T) => (container.current = n)];
}

// Router ////////

export interface RouterProps {
  routes: Route[];
  unknown?: JSX.Element;
  loading?: JSX.Element;
}

export function Router({ routes, loading, unknown: unknownRoute }: RouterProps): ReactNode {
  const cachedCleanRoutes = useMemo(() => routes.map<CleanRoute>(r => ({ ...r, segments: onlyTheCleanPath(r.path) })), [routes]);

  const [promiseOrNode, setPromiseOrNode] = useState(() => findComponent(cachedCleanRoutes, location.pathname));

  useGlobalNavigationEvent(ev => setPromiseOrNode(old => findComponent(cachedCleanRoutes, ev.to) || old), [routes]);

  const [node, setNode, setNodeSilently] = useStateSilently<ReactNode | null>(null);

  const synchronousFallback = useMemo(() => {
    // console.log("promiseOrNode is", promiseOrNode);
    if (promiseOrNode instanceof Promise) promiseOrNode.then(setNode);
    const n = !promiseOrNode ? unknownRoute : promiseOrNode instanceof Promise ? loading : promiseOrNode;
    setNode(n);
    return n;
  }, [promiseOrNode]);

  return node ?? synchronousFallback;
}
