import { useMemo, useRef, useState, type Dispatch, type JSX, type ReactNode, type SetStateAction } from "react";

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

export class RouterEvent extends Event {
  static Type = "router-event";
  /** for microfrontends, change this to the micro's root node */
  static Target = document.body;
  to: string;
  constructor(to: string) {
    super(RouterEvent.Type);
    this.to = to;
    // console.log("Going to ", to);
  }
}

export const goto = (path: string) => RouterEvent.Target.dispatchEvent(new RouterEvent(path));

export function useRouterEventHandler(handler: (evt: RouterEvent) => void, depArray: any[] = []) {
  const previous = useRef<EventListener | undefined>(void 0);
  useMemo(() => {
    if (previous.current) RouterEvent.Target.removeEventListener(RouterEvent.Type, previous.current);
    previous.current = handler as EventListener;
    RouterEvent.Target.addEventListener(RouterEvent.Type, previous.current);
  }, depArray);
}

// clean utils /////////

const pathToUrl = (path: string) => new URL(path.replace(/\/\//g, "/"), location.origin);

const onlyTheCleanPath = (path: string) =>
  pathToUrl(path)
    .pathname.split("/")
    .filter(x => !!x);

// find matching component //////

function findComponent(routes: CleanRoute[], path: string, setNode: Dispatch<SetStateAction<ReactNode>>, config: RouterConfig): ReactNode {
  const dest = onlyTheCleanPath(path);

  const matchedRoutes = routes.filter(r => dest.length == r.segments.length && dest.every((c, i) => c == r.segments[i] || r.segments[i].startsWith(":")));
  if (matchedRoutes.length !== 1) {
    console.error(matchedRoutes.length ? "Multiple" : "No", "route definitions for /" + dest.join("/"));
    matchedRoutes.map(o => console.error("#" + routes.indexOf(o) + "  /" + o.segments.join("/")));
  }

  const route = matchedRoutes[0];
  if (!route?.component) return `No component for route ${route}`;

  const props: Record<string, string | number> = {};
  for (let i = 0; i < dest.length; i++) {
    const routeSegment = route.segments[i];
    if (routeSegment.startsWith(":")) props[routeSegment.slice(1)] = dest[i];
  }

  window.history.pushState(void 0, "", pathToUrl(path)); // setBrowserUrl

  const promiseOrNode = route.component(props); // lazy loading will be a promise; cache on resolve to make synchronous?
  if (promiseOrNode instanceof Promise) promiseOrNode.then(setNode);

  const displayNode = promiseOrNode instanceof Promise ? config.loading : promiseOrNode ? promiseOrNode : config.unknown;
  setNode(displayNode);
  return displayNode;
}

// Router ////////

export interface RouterConfig {
  routes: Route[];
  unknown?: JSX.Element;
  loading?: JSX.Element;
}

export function Router(config: RouterConfig): ReactNode {
  const cleanRoutes = useMemo(() => config.routes.map<CleanRoute>(r => ({ ...r, segments: onlyTheCleanPath(r.path) })), [config.routes]);
  const [node, setNode] = useState<ReactNode>(() => findComponent(cleanRoutes, location.pathname, () => null, config));
  useRouterEventHandler(ev => findComponent(cleanRoutes, ev.to, setNode, config), [cleanRoutes]);
  return node;
}
