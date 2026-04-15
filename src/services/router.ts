import { useMemo, useRef, useState, type Dispatch, type JSX, type ReactNode, type SetStateAction } from "react";

export interface ReactComponent {
  (props?: object & any): JSX.Element | ReactNode;
}

interface ImportModule extends Object {
  [Symbol.toStringTag]?: "Module";
  default?: ReactComponent;
}

export interface Route {
  path: string;
  /** skeletons slightly differ from loading spinners because each are tailored to match the screen they're loading into */
  skeleton?: ReactComponent | ReactNode;
  //if?: () => boolean;
  loadComponent?: () => Promise<ReactComponent | ImportModule>;
  component?: ReactComponent;
  loadData?: () => any;
  //else?: ReactComponent;
}

interface CleanRoute extends Route {
  segments: string[];
}

const err = "[route config] ";

// goto URL /////

export class RouterEvent extends Event {
  static Type = "router-event";
  /** for microfrontends, change this to the micro's root node */
  static Target = document.body;
  to: string;
  data?: any;
  constructor(to: string, data?: any) {
    super(RouterEvent.Type);
    this.to = to;
    this.data = data;
    // console.log("Going to ", to);
  }
}

export const goto = (path: string, data?: any) => RouterEvent.Target.dispatchEvent(new RouterEvent(path, data));

function useRouterEventHandler(handler: (evt: RouterEvent) => void, depArray: any[] = []) {
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

function findComponent(routes: CleanRoute[], config: RouterConfig, setNode?: Dispatch<SetStateAction<ReactNode>>, ev?: RouterEvent): ReactNode {
  const setJsx = (anythingReactCanDisplay: ReactNode) => {
    setNode?.(anythingReactCanDisplay);
    return anythingReactCanDisplay;
  };

  const path = ev?.to || location.pathname;
  const dest = onlyTheCleanPath(path);

  const matchedRoutes = routes.filter(r => dest.length == r.segments.length && dest.every((c, i) => c == r.segments[i] || r.segments[i].startsWith(":")));
  if (matchedRoutes.length < 1) return setJsx(`${err}No route definitions for /${dest.join("/")}`);
  if (matchedRoutes.length > 1)
    return setJsx(`${err}Multiple route definitions for /${dest.join("/")}:\n${matchedRoutes.map(o => `#${routes.indexOf(o)}  /${o.segments.join("/")}\n`)}`);

  const route = matchedRoutes[0];
  if (!route || (!route.component && !route.loadComponent)) return setJsx(`${err}No component for route /${dest}`);

  const props: Record<string, string | number> = { data: ev?.data };
  for (let i = 0; i < dest.length; i++) {
    const routeSegment = route.segments[i];
    if (routeSegment.startsWith(":")) props[routeSegment.slice(1)] = dest[i];
  }

  window.history.pushState(void 0, "", pathToUrl(path)); // setBrowserUrl

  if (route.component) return setJsx(route.component(props));

  route.loadComponent?.().then((componentOrModule: any) => {
    route.component =
      componentOrModule[Symbol.toStringTag] === "Module"
        ? componentOrModule.default || (() => `${err}Route /${route.path} does not choose which export is the component nor is there a default export`)
        : componentOrModule;
    goto(path, ev?.data); // can't use setJsx on initial useState
  });

  if (typeof route.skeleton !== "undefined") return setJsx(typeof route.skeleton === "function" ? route.skeleton() : route.skeleton);
  if (typeof config.loading !== "undefined") return setJsx(typeof config.loading === "function" ? config.loading() : config.loading);
  return void 0; // don't change existing display with setJsx
}

// Router ////////

export interface RouterConfig {
  routes: Route[];
  loading?: ReactComponent | ReactNode;
}

export function Router(config: RouterConfig): ReactNode {
  const cleanRoutes = useMemo(() => config.routes.map<CleanRoute>(r => ({ ...r, segments: onlyTheCleanPath(r.path) })), [config.routes]);
  const [jsx, setJsx] = useState(() => findComponent(cleanRoutes, config));
  useRouterEventHandler(ev => findComponent(cleanRoutes, config, setJsx, ev), [cleanRoutes]);
  return jsx;
}
