const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Ajoutez ceci
const prestationRoutes = require("./routes/prestations");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

// Activez CORS pour toutes les requêtes
app.use(cors());

app.use(bodyParser.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Suivi Client",
      version: "1.0.0",
      description: "Documentation de l'API pour la gestion des prestations",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/prestations", prestationRoutes);

app.get("/", (req, res) => {
  res.send("Serveur backend opérationnel !");
});

module.exports = app;
