import { Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Box, ThemeProvider, CssBaseline } from "@mui/material";
import Home from "./pages/Home";
import Prestations from "./pages/Prestations";
import Stats from "./pages/Stats";
import Objectifs from "./pages/Objectifs";
import ClientDetails from "./pages/ClientDetails";
import MentalPreparation from "./pages/MentalPreparation";
import Layout from "./components/Layout";
import theme from "./theme/theme"; // Importation du Design System

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Réinitialisation globale pour Material-UI */}

      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prestations" element={<Prestations />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/objectifs" element={<Objectifs />} />
          <Route path="/mental-preparation" element={<MentalPreparation />} />
          <Route path="/client/:clientName" element={<ClientDetails />} />
          <Route path="*" element={<Box sx={{ textAlign: "center", mt: 3 }}>Page non trouvée</Box>} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
