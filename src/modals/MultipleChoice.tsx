import { ReactNode } from "react";
import { modal } from "./ModalProvider";

export interface Answer {
  label: ReactNode;
  value: string;
}

export const choiceModal = (ask: ReactNode, answers: Array<string | Answer>) => modal<string>(X => <MultipleChoice ask={ask} answers={answers} onSelect={X} />);

function MultipleChoice({ ask, answers, onSelect }: { ask: ReactNode; answers: Array<string | Answer>; onSelect: (answer: string) => void }) {
  return (
    <div>
      <div>{ask}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {answers.map(c =>
          typeof c === "string" ? (
            <button key={c} onClick={() => onSelect(c)}>
              {c}
            </button>
          ) : (
            <button key={c.value} onClick={() => onSelect(c.value)}>
              {c.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
