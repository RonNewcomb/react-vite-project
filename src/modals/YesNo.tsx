import { ReactNode } from "react";
import { modal } from "./ModalProvider";

export function yesNoModal(question: ReactNode) {
  return modal<boolean>(X => <YesNo question={question} onSelect={X} />);
}

export function YesNo({ question, onSelect }: { question: ReactNode; onSelect: (returnValue: boolean) => void }) {
  return (
    <div>
      <div>{question}</div>
      <button onClick={() => onSelect(true)}>Yes</button>
      <button onClick={() => onSelect(false)}>No</button>
    </div>
  );
}
