import { FormEventHandler, useState } from "react";

interface RenamingFormProps {
  name: string;
  onSubmit: (newName: string) => void;
}

export function RenamingForm({ name, onSubmit }: RenamingFormProps) {
  console.log("RenamingForm");
  const [newName, setNewName] = useState(name);

  const handler: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
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
