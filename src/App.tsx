import { PropsWithChildren, useState } from "react";
import "./App.css";
import { SmallForm } from "./components/SmallForm";
import { choiceModal } from "./modals/MultipleChoice";
import { modal, ModalProvider } from "./modals/providerModals";
import { yesNoModal } from "./modals/YesNo";
import reactLogo from "/assets/react.svg";
import viteLogo from "/assets/vite.svg";

export interface AppProps {
  initialCount?: number;
}

function ModalWrapper({ children }: PropsWithChildren<{}>) {
  return <div>{children}</div>;
}

export function App({ initialCount = 1 }: AppProps) {
  console.log("APP rerender");
  const [count, setCount] = useState(initialCount);
  const [cls, setCls] = useState("read-the-docs");

  const bigform = async () => {
    const result = await modal(X => <SmallForm onSubmit={X} />);
    console.log("Modal result", result);
  };

  return (
    <ModalProvider modalComponent={ModalWrapper}>
      <div className="centeredcolumn">
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount(count => count + 1)}>count is {count}</button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className={cls} onClick={() => setCls(cls ? "" : "read-the-docs")}>
          Click on the Vite and React logos to learn more
        </p>

        <div>
          <button onClick={() => yesNoModal(<h2>Bananas?</h2>).then(console.log)}>Ask "Bananas?"</button>
          <button onClick={() => choiceModal(<h2>Fruit?</h2>, ["Apple", "Banana", "Peach", "Orange"]).then(console.log)}>Ask "Fruit?"</button>
          <button onClick={bigform}>ASK</button>
        </div>

        <SmallForm onSubmit={console.warn} />
      </div>
    </ModalProvider>
  );
}
