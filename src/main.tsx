import App from "./app.tsx";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <App />
    </div>
  </React.StrictMode>,
);
