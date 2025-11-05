export const NavEventType = "nav-event";

export class NavEvent extends Event {
  to: string = "";
}

export async function goto(path: string) {
  const event = new NavEvent(NavEventType);
  event.to = path;
  document.body.dispatchEvent(event);
}

export const attach = (handler: (ev: NavEvent) => void) => document.body.addEventListener(NavEventType, handler as any);
export const detach = (handler: (ev: NavEvent) => void) => document.body.removeEventListener(NavEventType, handler as any);

export const setBrowserUrl = (path: string, data?: any) => window.history.pushState(data, "", path);
