import { JSX } from "react";
import { createRoot } from "react-dom/client";

/**
 * Usage: const answer = await modal<boolean>(close => <YesNo ask="Do you like bananas?" close={close} />);
 * @param renderProp A function that creates JSX.Element using the closeModal function passed into it
 * @returns A promise of T which was the value given to the closeModal function
 */
export function modal<T>(renderProp: (closeModal: (returnValue: T) => void) => JSX.Element): Promise<T> {
  const overlay = document.createElement("div");
  overlay.setAttribute("style", "position:fixed; top:0; left:0; height:100vh; width:100vw; background-color:rgba(0,0,0,0.5)");
  document.body.appendChild(overlay);
  return new Promise(resolve => {
    const root = createRoot(overlay);
    root.render(
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", backgroundColor: document.body.style.backgroundColor }}>
        {renderProp(modalResult => {
          root.unmount();
          document.body.removeChild(overlay);
          resolve(modalResult);
        })}
      </div>
    );
  });
}
