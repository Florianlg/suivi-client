const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/suiviClient.db");

const handler = async (req, res) => {
  const { method, query } = req;

  if (method === "GET" && query.clientName) {
    // Récupérer les prestations d'un client spécifique
    db.all(
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
  } else if (method === "GET" && query.type === "mental-preparation-stats") {
    // Récupérer les statistiques pour la préparation mentale
    db.all(
      `SELECT 
                strftime('%Y', date) AS year, 
                ((strftime('%m', date) - 1) / 3 + 1) AS quarter, 
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
          return res
            .status(500)
            .json({
              error: "Erreur lors de la récupération des statistiques.",
            });
        }
        return res.json(rows);
      }
    );
  } else if (method === "POST") {
    // Ajouter une prestation
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
    } = req.body;

    if (!clientName || !prestationType || !date || !price || !provider) {
      return res
        .status(400)
        .json({ error: "Tous les champs obligatoires doivent être remplis." });
    }

    db.run(
      `INSERT INTO prestations (clientName, prestationType, date, price, provider, sessionType, startDate, endDate, excludeFromObjectives) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      function (err) {
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
  } else {
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
};

module.exports = handler;
