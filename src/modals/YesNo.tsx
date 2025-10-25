import { ReactNode } from "react";
import { modal } from "./providerModals";

export function yesNoModal(question: ReactNode) {
  return modal<boolean>(close => <YesNo onSelect={close}>{question}</YesNo>);
}

export function YesNo({ children, onSelect }: { children: any; onSelect: (answer: boolean) => void }) {
  return (
    <div>
      <div>{children}</div>
      <button onClick={() => onSelect(true)}>Yes</button>
      <button onClick={() => onSelect(false)}>No</button>
    </div>
  );
}
