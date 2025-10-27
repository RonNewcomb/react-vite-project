import { ReactNode } from "react";
import { modal } from "./ModalProvider";

/**
 * Asks a multiple-choice question, returning the result.
 * @param ask The question for the user as a string or some JSX.
 * @param answers an array of possible answers, either either a string or a label + value object.
 * @returns a promise of the string (value) chosen.
 */
export function yesNoModal(question: ReactNode) {
  return modal<boolean>(X => <YesNo question={question} onSelect={X} />);
}

interface YesNoProps {
  question: ReactNode;
  onSelect: (returnValue: boolean) => void;
}

export function YesNo({ question, onSelect }: YesNoProps) {
  return (
    <div data-testid="YesNo">
      <div>{question}</div>
      <button onClick={() => onSelect(true)}>Yes</button>
      <button onClick={() => onSelect(false)}>No</button>
    </div>
  );
}
