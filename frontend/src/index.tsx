import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Get the element with the ID 'root'
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// Create a root
const root = ReactDOM.createRoot(rootElement);

// Render the App component into the root
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
