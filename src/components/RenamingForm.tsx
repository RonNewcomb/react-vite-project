import { FormEventHandler, useState } from "react";
import { yesNoModal } from "../modals/YesNo";

interface RenamingFormProps {
  name: string;
  onSubmit: (newName: string) => void;
}

export function RenamingForm({ name, onSubmit }: RenamingFormProps) {
  console.log("RenamingForm");
  const [newName, setNewName] = useState(name);

  const handler: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    const yes = await yesNoModal("Are you sure?");
    if (!yes) return;
    onSubmit(newName);
  };

  return (
    <form onSubmit={handler} style={{ display: "flex", flexDirection: "column" }}>
      Name:
      <input name="name" value={newName} onChange={e => setNewName(e.currentTarget.value)} />
      <button>Submit</button>
    </form>
  );
}
