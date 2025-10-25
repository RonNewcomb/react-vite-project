import { FormEvent, PropsWithChildren } from "react";

export interface BoiledFormElement {
  type: string;
  tagName: string;
  name: string;
  id: string;
  value: string | undefined;
  checked: boolean | undefined;
  i: number;
  selected: boolean | undefined;
  options?: BoiledFormElement[];
}

export function boilForm(e: FormEvent<HTMLFormElement>): BoiledFormElement[] {
  e.preventDefault();
  const felements = Array.from(e.currentTarget.elements) as HTMLFormElement[];
  return felements.map(boil);
}

export function boil(el: HTMLFormElement, i: number): BoiledFormElement {
  const { tagName, type, name, id, value, checked, selected, options: maybe } = el;
  const options = !maybe ? undefined : Array.from(maybe as HTMLFormElement[])?.map(boil);
  return { tagName, type, name, id, value, i, checked, selected, options } satisfies BoiledFormElement;
}

function FlexForm({ children }: PropsWithChildren<unknown>) {
  return <div style={{ display: "flex", justifyContent: "space-between" }}>{children}</div>;
}

export function SmallForm({ onSubmit }: { onSubmit: (x: BoiledFormElement[]) => void }) {
  return (
    <form onSubmit={e => onSubmit(boilForm(e))}>
      <div>
        Name:
        <input name="name" />
      </div>
      <div>
        Age:
        <input name="age" type="number" />
      </div>
      <div>
        <input name="if" type="checkbox" value="when" /> If?
      </div>
      <div>
        Fruit:
        <select multiple>
          <option>Banana</option>
          <option>Peach</option>
          <option>Orange</option>
        </select>
      </div>
      <div>
        Fruit:
        <input type="radio" name="fruit" value="Apple" />
        <input type="radio" name="fruit" value="Banana" />
        <input type="radio" name="fruit" value="Peach" />
        <input type="radio" name="fruit" value="Orange" />
      </div>
      <div>
        Birthday
        <input type="date" name="Birthday" />
        <input type="datetime-local" name="party" />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
