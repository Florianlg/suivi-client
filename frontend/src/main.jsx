import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ProtectedApp from "./pages/ProtectedApp"; // Utilisez ProtectedApp comme composant principal

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProtectedApp />
    </BrowserRouter>
  </React.StrictMode>
);
