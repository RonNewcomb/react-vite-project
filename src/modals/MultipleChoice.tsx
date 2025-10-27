import { ReactNode } from "react";
import { modal } from "./ModalProvider";

/**
 * Asks a multiple-choice question, returning the result.
 * @param ask The question for the user as a string or some JSX.
 * @param answers an array of possible answers, either either a string or a label + value object.
 * @returns a promise of the string (value) chosen.
 */
export function choiceModal(ask: ReactNode, answers: Array<string | Answer>) {
  return modal<string>(X => <MultipleChoice ask={ask} answers={answers} onSelect={X} />);
}

interface Answer {
  label: ReactNode;
  value: string;
}

interface MultipleChoiceProps {
  ask: ReactNode;
  answers: Array<string | Answer>;
  onSelect: (answer: string) => void;
}

function MultipleChoice({ ask, answers, onSelect }: MultipleChoiceProps) {
  return (
    <div data-testid="MultipleChoice">
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
