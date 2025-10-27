# Modal Popups from Async Functions

- Make any React component a modal!
- Call modals like ordinary async functions! Await the submit!
- Autofocus!
- Fully CSS customizable!
- No dependencies!
- Less than 150 lines of code!
- Includes modal-on-modal action!

```typescript
const modalResult = await modal<YourReturnType>(X => <YourComponent onClick={X} />);
```

## Example

Wrap a component in the `modal()` function and call the provided X function to close the modal, just like pressing the "X" button in its top-right corner.

```tsx
export async function renameModal(oldName: string) {
  const newName = await modal<string>(X => <RenamingForm name={oldName} onSubmit={X} />);
  return newName;
}
```

Now you can call your form from anywhere _in a single line_. No more `useState(show)` cluttering every page!

```tsx
export function SomewhereComponent() {
 const [recordName, setRecordName] = useState("et cetera");

  const clickHandler = async () => {
    const newName = await renameModal(recordName); // pops modal, gets answer
    if (newName) setRecordName(newName);
  };

  return <button onClick={clickHandler}>Rename</div>;
}
```

Alternately, if it's a one-off just skip the middleman.

```tsx
export function SomewhereComponent() {
 const [recordName, setRecordName] = useState("et cetera");

  const handler = async () => {
    const newName = await modal<string>(X => <RenamingForm name={recordName} onSubmit={X} />);
    if (newName) setRecordName(newName);
  };

  return <button onClick={handler}>Rename</div>;
}
```

## Setup

Wrap your app in the `<ModalProvider/>` component where the other Providers live. Probably, leave it inside any themeing provider, but outside other components like auth that might need to use modals.

```tsx
<ThemeProvider>
  {theme => (
    <UserContextProvider>
      <ModalProvider backgroundColor={theme.bg} style={{ padding: 16 }} msDismissDelay={250} exitClassName="modal-close">
        <AuthProvider>
          <App />
        </AuthProvider>
      </ModalProvider>
    </UserContextProvider>
  )}
</ThemeProvider>
```

## Options

Options are sent into the `<ModalProvider />` and are used on all modals.

Give it a `backgroundColor` for the modal since they default to transparent. This is the only required option. You may change this depending on light/dark theme, for instance. If this is provided by the below properties you can set it to an empty string.

The `style` prop is set inline on each modal. It also accepts a function which gives you the values it was going to use so you can transform them however you wish.

The `className` prop passes the CSS classes onto the modal. There are no pre-existing classes to clash with, but remember the default `style` will override anything set by className.

The `overlayStyle` is the same as `style` but it is for the dimming effect of the overlay that lies between the modal and the page underneath. It also accepts a function which gives you the values it was going to use so you can transform them however you wish.

The `overlayClassName` prop passes the classes onto the overlay. There are no pre-existing classes to clash with, but remember the default `overlayStyle` will override anything set by className.

The `msDismissDelay` is the number of milliseconds to wait until removing the modal from the DOM. This gives any exit animations you've made time to play out. Nicely, it doesn't block the async call's return.

The `exitClassName` works with `msDismissDelay`. It accepts a string, the css class name to place onto the modal when it is beginning dismissal.

## Details

The `<ModalProvider/>` only renders once (assuming, of course, nothing upwind of it causes everything to do so). The individual modals also tend to render only when a modal is first started or just finished. You don't have to worry about entire app re-renders from popping modals.

It autofocuses the first focusable element in the modal.

You can pop modals on top of modals if you want. Some may question your UX brilliance but they're just haters.

Check out the readable DOM!

## TODO

- ARIA screenreaders

## Examples

### Full Implementation of a Reusable Yes/No Modal

```tsx
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
```

### Full Implementation of a Reusable Multiple-Choice Modal

```tsx
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
```

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR.

`npm create vite@latest my-react-app -- --template react-ts`

`npm install`

`npm run dev`
