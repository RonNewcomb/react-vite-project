import { JSX } from "react";
import { modal } from "./providerModals";

export const choiceModal = (ask: string | JSX.Element, answers: string[]) =>
  modal<string>(close => (
    <MultipleChoice answers={answers} onSelect={close}>
      {ask}
    </MultipleChoice>
  ));

function MultipleChoice({ children, answers, onSelect }: { children: any; answers: string[]; onSelect: (answer: string) => void }) {
  return (
    <div>
      <div>{children}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {answers.map(c => (
          <button key={c} onClick={() => onSelect(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
