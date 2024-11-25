import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react"; // Import Auth0Provider
import App from "./App"; // Import App

// Informations Auth0 (remplacez par vos valeurs)
const domain = "dev-bf30f2spk3jpcvs5.uk.auth0.com";
const clientId = "Thx4YCT23bc7dK4MYaucfjMRgCudIXHz";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Fournir le contexte Auth0 à toute l'application */}
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin, // Redirection après authentification
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
