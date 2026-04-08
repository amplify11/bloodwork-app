import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Minimal localStorage shim for window.storage used by App
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    get: async (k) => ({ value: localStorage.getItem(k) }),
    set: async (k, v) => localStorage.setItem(k, v),
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
