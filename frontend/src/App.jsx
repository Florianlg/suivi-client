import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0

import Home from "./pages/Home";
import Prestations from "./pages/Prestations";
import Stats from "./pages/Stats";
import Objectifs from "./pages/Objectifs";
import ClientDetails from "./pages/ClientDetails";
import MentalPreparation from "./pages/MentalPreparation";

const App = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } =
    useAuth0();

  // Affichage d'un écran de chargement pendant l'authentification
  if (isLoading) {
    return (
      <Container style={{ marginTop: "20px", textAlign: "center" }}>
        <Typography variant="h5">Chargement...</Typography>
      </Container>
    );
  }

  return (
    <>
      {/* Barre de navigation */}
      <AppBar position="static">
        <Toolbar>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/">
                Ajouter une prestation
              </Button>
              <Button color="inherit" component={Link} to="/prestations">
                Voir les prestations
              </Button>
              <Button color="inherit" component={Link} to="/stats">
                Statistiques
              </Button>
              <Button color="inherit" component={Link} to="/objectifs">
                Objectifs
              </Button>
              <Button color="inherit" component={Link} to="/mental-preparation">
                Préparation mentale
              </Button>
              <Button
                color="inherit"
                onClick={() =>
                  logout({ returnTo: window.location.origin })
                }
              >
                Déconnexion
              </Button>
              <Typography sx={{ ml: 2, fontSize: 16 }}>
                Bonjour, {user?.name}
              </Typography>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => loginWithRedirect()}
            >
              Connexion
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Container style={{ marginTop: "20px" }}>
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prestations" element={<Prestations />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/objectifs" element={<Objectifs />} />
            <Route
              path="/mental-preparation"
              element={<MentalPreparation />}
            />
            <Route
              path="/client/:clientName"
              element={<ClientDetails />}
            />
            <Route path="*" element={<div>Page non trouvée</div>} />
          </Routes>
        ) : (
          <Typography variant="h6" align="center">
            Veuillez vous connecter pour accéder au contenu.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default App;
