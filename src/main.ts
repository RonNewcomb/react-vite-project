import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { App, AppProps } from "./App.tsx";
import "./main.css";

const div = document.getElementById("root");
if (!div) throw Error('Cannot find <div id="root"> in index.html');
const props: AppProps = { initialCount: 5 };
createRoot(div).render(createElement(App, props));
