import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";

const div = document.getElementById("root");
if (!div) throw Error('Cannot find <div id="root"> in index.html');

createRoot(div).render(
  <StrictMode>
    <App />
  </StrictMode>
);
