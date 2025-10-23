import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./main.css";

const div = document.getElementById("root");
if (!div) throw Error('Cannot find <div id="root"> in index.html');

// // as a .ts file (strict mode not shown)
// const props: AppProps = { initialCount: 5 };
// createRoot(div).render(createElement(App, props));

// as a .tsx file
createRoot(div).render(
  <StrictMode>
    <App initialCount={5} />
  </StrictMode>
);

// createRoot(div).render(<App initialCount={5} />);
