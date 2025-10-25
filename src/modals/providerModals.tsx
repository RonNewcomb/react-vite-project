import { CSSProperties, DetailedHTMLProps, Dispatch, HTMLAttributes, JSX, PropsWithChildren, ReactNode, SetStateAction, useState } from "react";

let setWindows: Dispatch<SetStateAction<ReactNode[]>> = () => [] as ReactNode[];

/**
 * Usage: const answer = await modal<boolean>(close => <YesNo ask="Do you like bananas?" close={close} />);
 * @param renderProp A function that creates JSX.Element using the X function passed into it
 * @returns A promise of T which was the value given to the X function
 */
export function modal<T>(renderProp: (X: (returnValue: T) => void) => JSX.Element): Promise<T> {
  return new Promise(resolve => {
    setWindows(old => [
      ...old,
      renderProp(modalResult => {
        setWindows(old => old.slice(0, old.length - 1));
        resolve(modalResult);
      }),
    ]);
  });
}

const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)";
const defaultOverlayStyle: CSSProperties = { position: "fixed", top: 0, left: 0, height: "100vh", width: "100vw", backgroundColor: "rgba(0,0,0,0.5)" };
const defaultModalStyle: CSSProperties = {
  position: "fixed",
  display: "flex",
  justifyContent: "center",
  backgroundColor: theme,
};

export interface ModalProviderProps {
  overlayStyle?: CSSProperties | ((old: CSSProperties) => CSSProperties);
  overlayClassName?: string;
  modalStyle?: CSSProperties | ((old: CSSProperties) => CSSProperties);
  modalClassName?: string;
  modalComponent?: ({ children }: PropsWithChildren<{}>) => JSX.Element;
}

export function ModalProvider(props: PropsWithChildren<ModalProviderProps>) {
  console.log("ModalProvider");
  return (
    <modal-provider>
      {props.children}
      <ModalList {...props} />
    </modal-provider>
  );
}

/**
 * split off from ModalProvider so when pop happens ModalProvider is not re-rendered, only this is
 */
function ModalList({ modalStyle, modalClassName }: ModalProviderProps) {
  console.log("ModalList");
  const [modals, setModals] = useState<ReactNode[]>([]);
  setWindows = setModals;
  const style = typeof modalStyle === "function" ? modalStyle(defaultModalStyle) : modalStyle || defaultModalStyle;
  return (
    <modal-list>
      {modals.map((m, i) => (
        <modal-overlay style={defaultOverlayStyle} key={i}>
          <modal-modal style={style} className={modalClassName || ""}>
            {m}
          </modal-modal>
        </modal-overlay>
      ))}
    </modal-list>
  );
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "modal-provider": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      "modal-list": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      "modal-overlay": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      "modal-modal": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

/**
 * With appending to document.body:
 *   + no rerenders from React
 *   - can't use React context values
 *
 * With using Provider
 *   - rerenders whole app
 *   + can use context values
 */
