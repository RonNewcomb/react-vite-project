import { modal } from "./ModalProvider";
import { choiceModal } from "./MultipleChoice";
import { YesNo, yesNoModal } from "./YesNo";

export async function examples() {
  const examples: { [key: string]: any } = {
    answer1: await modal<boolean>(X => <YesNo question="Do you like bananas?" onSelect={X} />),
    answer2: await modal<React.MouseEvent>(X => <div onClick={X}>Click here to continue.</div>),
    answer3: await yesNoModal("Bananas?"),
    answer4: await choiceModal("Fruit?", ["Apples", "Bananas", "Oranges"]),
  };
  return examples;
}

export async function pexamples() {
  const examples: { [key: string]: any } = {
    answer1: await modal<boolean>(X => <YesNo question="Do you like bananas?" onSelect={X} />),
    answer2: await modal<React.MouseEvent>(X => <div onClick={X}>Click here to continue.</div>),
    answer3: await yesNoModal("Bananas?"),
    answer4: await choiceModal("Fruit?", ["Apples", "Bananas", "Oranges"]),
  };
  return examples;
}
