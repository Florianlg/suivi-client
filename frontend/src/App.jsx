import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Container } from "@mui/material";
import Home from "./pages/Home";
import Prestations from "./pages/Prestations";
import Stats from "./pages/Stats";
import Objectifs from "./pages/Objectifs";
import ClientDetails from "./pages/ClientDetails";
import MentalPreparation from "./pages/MentalPreparation";

const App = () => {
  return (
    <>
      {/* Barre de navigation */}
      <AppBar position="static">
        <Toolbar>
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
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Container style={{ marginTop: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prestations" element={<Prestations />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/objectifs" element={<Objectifs />} />
          <Route path="/mental-preparation" element={<MentalPreparation />} />
          <Route path="/client/:clientName" element={<ClientDetails />} />
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
