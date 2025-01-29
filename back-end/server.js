const express = require("express");
const cors = require("cors");
const prestationRoutes = require("./routes/prestations");

const app = express();

const allowedOrigins = [
  "http://localhost:4173", // Frontend local
  "https://frontend-xn8p.onrender.com", // Frontend déployé
];

// Configuration du CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origine (ex. clients REST ou serveurs internes)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin non autorisée par CORS"));
      }
    },
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

// 🔍 Vérifier quelles routes sont bien enregistrées
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`✅ Route enregistrée : ${r.route.path}`);
  }
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Erreur interne du serveur." });
});

module.exports = app;
