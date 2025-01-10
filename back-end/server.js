const express = require("express");
const cors = require("cors");
const prestationRoutes = require("./routes/prestations");

const app = express();

// Configuration du CORS
app.use(
  cors({
    origin: "http://localhost:4173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Permet l'envoi de cookies ou d'autres informations d'identification
  })
);

// Middleware pour parser les JSON
app.use(express.json());

// Middleware pour loguer les requêtes
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Routes
app.use("/prestations", prestationRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Erreur interne du serveur." });
});

module.exports = app;
