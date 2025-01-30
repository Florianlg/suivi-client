import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Box } from "@mui/material";
import Home from "./pages/Home";
import Prestations from "./pages/Prestations";
import Stats from "./pages/Stats";
import Objectifs from "./pages/Objectifs";
import ClientDetails from "./pages/ClientDetails";
import MentalPreparation from "./pages/MentalPreparation";

const App = () => {
  return (
    <>
      {/* Barre de navigation optimisée pour la responsivité */}
      <AppBar position="static" sx={{ bgcolor: "#333" }}>
        <Toolbar sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { label: "Ajouter une prestation", to: "/" },
            { label: "Voir les prestations", to: "/prestations" },
            { label: "Statistiques", to: "/stats" },
            { label: "Objectifs", to: "/objectifs" },
            { label: "Préparation mentale", to: "/mental-preparation" },
          ].map((item, index) => (
            <Button
              key={index}
              color="inherit"
              component={Link}
              to={item.to}
              sx={{
                mx: 1,
                fontSize: { xs: "0.75rem", md: "1rem" },
                flexShrink: 0,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      {/* Contenu principal optimisé */}
      <Container sx={{ marginTop: 3, maxWidth: { xs: "100%", md: "800px" } }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prestations" element={<Prestations />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/objectifs" element={<Objectifs />} />
          <Route path="/mental-preparation" element={<MentalPreparation />} />
          <Route path="/client/:clientName" element={<ClientDetails />} />
          <Route path="*" element={<Box sx={{ textAlign: "center", mt: 3 }}>Page non trouvée</Box>} />
        </Routes>
      </Container>
    </>
  );
};

export default App;