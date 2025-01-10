require("dotenv").config();
const mysql = require("mysql2");
const connection = require("./db");

// Route : Obtenir les clients distincts
const handler = async (req, res) => {
  const { method, path, query, body } = req;

  console.log("[DEBUG] Requête reçue :", { method, path, query, body });

  if (method === "GET" && path === "/clients") {
    connection.query(
      "SELECT DISTINCT clientName FROM prestations",
      [],
      (err, rows) => {
        if (err) {
          console.error(
            "Erreur lors de la récupération des clients :",
            err.message
          );
          return res.status(500).json({ error: "Erreur interne du serveur." });
        }
        return res.json(rows);
      }
    );

    // Route : Obtenir toutes les prestations
  } else if (method === "GET" && path === "/") {
    connection.query("SELECT * FROM prestations", [], (err, rows) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des prestations :",
          err.message
        );
        return res.status(500).json({ error: "Erreur interne du serveur." });
      }
      return res.json(rows);
    });

    // Route : Obtenir les prestations d'un client spécifique
  } else if (method === "GET" && query.clientName) {
    connection.query(
      `SELECT * FROM prestations WHERE clientName = ?`,
      [query.clientName],
      (err, rows) => {
        if (err) {
          console.error(
            "Erreur lors de la récupération des prestations :",
            err.message
          );
          return res
            .status(500)
            .json({ error: "Erreur lors de la récupération des prestations." });
        }
        if (rows.length === 0) {
          return res
            .status(404)
            .json({ error: "Aucune prestation trouvée pour ce client." });
        }
        return res.json(rows);
      }
    );

    // Route : Ajouter une prestation
  } else if (method === "POST" && (path === "/" || path === "/prestations")) {
    const {
      clientName,
      prestationType,
      date,
      price,
      provider,
      sessionType,
      startDate,
      endDate,
      excludeFromObjectives,
    } = body;

    if (!clientName || !prestationType || !date || !price || !provider) {
      return res
        .status(400)
        .json({ error: "Tous les champs obligatoires doivent être remplis." });
    }

    connection.query(
      `INSERT INTO prestations (clientName, prestationType, date, price, provider, sessionType, startDate, endDate, excludeFromObjectives) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientName,
        prestationType,
        date,
        price,
        provider,
        sessionType,
        startDate,
        endDate,
        excludeFromObjectives || 0,
      ],
      (err) => {
        if (err) {
          console.error(
            "Erreur lors de l’ajout de la prestation :",
            err.message
          );
          return res
            .status(500)
            .json({ error: "Erreur lors de l’ajout de la prestation." });
        }
        return res
          .status(201)
          .json({ message: "Prestation ajoutée avec succès !" });
      }
    );

    // Route : Obtenir les statistiques de préparation mentale
  } else if (method === "GET" && query.type === "mental-preparation-stats") {
    connection.query(
      `SELECT 
        YEAR(date) AS year, 
        QUARTER(date) AS quarter, 
        COUNT(DISTINCT clientName) AS clients, 
        COUNT(*) AS prestations, 
        SUM(price) AS ca
      FROM prestations
      WHERE prestationType = 'Préparation mentale'
      GROUP BY year, quarter
      ORDER BY year, quarter`,
      [],
      (err, rows) => {
        if (err) {
          console.error(
            "Erreur lors de la récupération des statistiques :",
            err.message
          );
          return res.status(500).json({
            error: "Erreur lors de la récupération des statistiques.",
          });
        }
        return res.json(rows);
      }
    );

    // Route non reconnue
  } else {
    console.warn("[WARN] Route ou méthode non prise en charge :", {
      method,
      path,
    });
    return res.status(404).json({ error: "La page demandée est introuvable." });
  }
};

module.exports = handler;
