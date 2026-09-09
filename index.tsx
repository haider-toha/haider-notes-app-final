import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import BookPrototype from "./components/BookPrototype";
import LinedNotebook from "./components/LinedNotebook";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/notebook" element={<LinedNotebook />} />
        <Route path="/book-test" element={<BookPrototype />} />
        <Route path="/" element={<App />} />
        <Route path="/:folder" element={<App />} />
        <Route path="/:folder/:slug" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
