import {
  CSSProperties,
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  JSX,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

export type CloseTheModalFn<T> = (returnValue: T) => void;

let setOpenModals: Dispatch<SetStateAction<ReactNode[]>> = () => [];
let dismissalDelay = 0;

/**
 * Usage:
 * `const answer = await modal<YourReturnType>(closeModalFunction => \<YourComponent onClick={closeModalFunction} />);`
 * @param renderProp A function that creates JSX.Element using the X function passed into it
 * @returns A promise of T which was the value given to the X function
 */
export function modal<T>(renderProp: (X: CloseTheModalFn<T>) => JSX.Element): Promise<T> {
  return new Promise(resolve => {
    setOpenModals(list => [
      ...list,
      renderProp(modalResult => {
        resolve(modalResult);
        setTimeout(() => setOpenModals(old => old.slice(0, old.length - 1)), dismissalDelay);
      }),
    ]);
  });
}

/// default values, ok for user to mess with /////

export const defaultOverlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  overflow: "auto",
  backgroundColor: "rgba(0,0,0,0.5)",
};

export const defaultModalStyle: CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

///////////////////////////

export interface ModalProviderProps {
  /** without background color the modal will default to transparent backing */
  backgroundColor: CSSProperties["backgroundColor"] | "";
  /** style used on the modal itself. Accepts a function which gives the values it was going to use. */
  style?: CSSProperties | ((old: CSSProperties) => CSSProperties);
  /** css classes to place on the modal */
  className?: string;
  /** style used on the overlay. Accepts a function which gives the values it was going to use. */
  overlayStyle?: CSSProperties | ((old: CSSProperties) => CSSProperties);
  /** css classes to place on the overlay */
  overlayClassName?: string;
  /** milliseconds to wait until removing modal from DOM; allows exit animations to play out */
  msDismissDelay?: number;
}

export function ModalProvider({ children, ...props }: PropsWithChildren<ModalProviderProps>) {
  console.log("ModalProvider");
  return (
    <modal-provider>
      {/* DO NOT re-render children if at all possible */}
      {children}
      <ModalsList {...props} />
    </modal-provider>
  );
}

const focusable = "input,select,textarea,button,a[href],[tabindex]:not([tabindex='-1'])";

/**
 * split off from ModalProvider so when pop happens ModalProvider is not re-rendered, only this is
 */
function ModalsList({ msDismissDelay, style, className, overlayClassName, overlayStyle, backgroundColor }: ModalProviderProps) {
  console.log("ModalList");
  const [modals, setModals] = useState<ReactNode[]>([]);

  // settings
  setOpenModals = setModals;
  dismissalDelay = msDismissDelay || 0;

  // CSS
  const userModalStyle = typeof style === "function" ? style(defaultModalStyle) : style;
  const userOverlayStyle = typeof overlayStyle === "function" ? overlayStyle(defaultOverlayStyle) : overlayStyle;
  const finalModalStyle = { ...defaultModalStyle, backgroundColor, ...(userModalStyle || {}) };
  const finalOverlayStyle = { ...defaultOverlayStyle, ...(userOverlayStyle || {}) };

  // autofocus
  const modalEl = useRef<HTMLElement>(null!);
  useEffect(() => {
    const el = modalEl.current;
    if (!el) return;
    el.querySelector<HTMLElement>(focusable)?.focus?.();
    const onFocus = (e: FocusEvent) => !el.contains(e.target as HTMLElement) && el.querySelector<HTMLElement>(focusable)?.focus?.();
    document.body.addEventListener("focusin", onFocus);
    return () => document.body.removeEventListener("focusin", onFocus);
  }, [modals.length]);

  return modals.map((m, i) => (
    <modal-overlay style={finalOverlayStyle} className={overlayClassName || ""} key={i}>
      <the-modal style={finalModalStyle} className={className || ""} ref={modalEl}>
        {m}
      </the-modal>
    </modal-overlay>
  ));
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "modal-provider": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      "modal-overlay": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      "the-modal": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
