const express = require("express");
const db = require("../db/sqlite");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Prestation:
 *       type: object
 *       required:
 *         - clientName
 *         - prestationType
 *         - price
 *         - provider
 *         - date
 *       properties:
 *         id:
 *           type: integer
 *           description: L'identifiant unique de la prestation
 *         clientName:
 *           type: string
 *           description: Nom du client
 *         prestationType:
 *           type: string
 *           description: Type de prestation
 *         date:
 *           type: string
 *           format: date
 *           description: Date de la prestation
 *         price:
 *           type: number
 *           description: Prix de la prestation
 *         provider:
 *           type: string
 *           description: Nom du prestataire
 *         startDate:
 *           type: string
 *           format: date
 *           description: Date de début
 *         endDate:
 *           type: string
 *           format: date
 *           description: Date de fin
 *         sessionType:
 *           type: string
 *           description: Type d'accompagnement
 *         excludeFromObjectives:
 *           type: boolean
 *           description: Exclure cette prestation des objectifs
 */

/**
 * @swagger
 * /prestations:
 *   get:
 *     summary: Récupérer toutes les prestations
 *     responses:
 *       200:
 *         description: La liste des prestations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prestation'
 */
// Récupérer toutes les prestations
router.get("/", (req, res) => {
  db.all("SELECT * FROM prestations", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des prestations." });
    } else {
      res.json(rows);
    }
  });
});

/**
 * @swagger
 * /prestations:
 *   post:
 *     summary: Ajouter une nouvelle prestation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prestation'
 *     responses:
 *       201:
 *         description: Prestation ajoutée avec succès
 */ // Ajouter une prestation
router.post("/", (req, res) => {
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
        console.error("Erreur lors de l’ajout de la prestation :", err.message);
        return res
          .status(500)
          .json({ error: "Erreur lors de l’ajout de la prestation." });
      }
      res.status(201).json({ message: "Prestation ajoutée avec succès !" });
    }
  );
});

/**
 * @swagger
 * /prestations/{id}:
 *   delete:
 *     summary: Supprimer une prestation par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la prestation à supprimer
 *     responses:
 *       200:
 *         description: Prestation supprimée avec succès
 *       404:
 *         description: Prestation non trouvée
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM prestations WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error(err.message);
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de la prestation." });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Prestation non trouvée." });
    } else {
      res.json({ message: "Prestation supprimée avec succès." });
    }
  });
});

// Route pour récupérer les prestations d'un client spécifique
router.get("/client/:clientName", (req, res) => {
  const { clientName } = req.params;

  db.all(
    `SELECT * FROM prestations WHERE clientName = ?`,
    [clientName],
    (err, rows) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des prestations :",
          err.message
        );
        res
          .status(500)
          .json({ error: "Erreur lors de la récupération des prestations." });
      } else if (rows.length === 0) {
        res
          .status(404)
          .json({ error: "Aucune prestation trouvée pour ce client." });
      } else {
        res.json(rows);
      }
    }
  );
});

// Route pour récupérer tous les clients uniques
router.get("/clients", (req, res) => {
  db.all("SELECT DISTINCT clientName FROM prestations", [], (err, rows) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des clients :",
        err.message
      );
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des clients." });
    } else {
      const clients = rows.map((row) => ({ clientName: row.clientName }));
      res.json(clients);
    }
  });
});

router.post("/update-client", (req, res) => {
  const { clientName, prestation } = req.body;

  if (!clientName || !prestation) {
    return res
      .status(400)
      .json({ error: "Nom du client et prestation requis." });
  }

  // Ajouter la prestation au client existant
  db.run(
    `INSERT INTO prestations (clientName, prestationType, date, price, provider, startDate, endDate, sessionType) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      clientName,
      prestation.prestationType,
      prestation.date,
      prestation.price,
      prestation.provider,
      prestation.startDate || null,
      prestation.endDate || null,
      prestation.sessionType || null,
    ],
    function (err) {
      if (err) {
        console.error("Erreur lors de la mise à jour du client :", err.message);
        return res
          .status(500)
          .json({ error: "Erreur lors de la mise à jour du client." });
      }
      res.status(201).json({
        message: "Prestation ajoutée au client existant avec succès.",
      });
    }
  );
});

router.get("/clients-with-prestations", (req, res) => {
  db.all(
    `SELECT clientName, prestationType, date, price, provider 
       FROM prestations`,
    [],
    (err, rows) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des prestations :",
          err.message
        );
        res
          .status(500)
          .json({ error: "Erreur lors de la récupération des prestations." });
      } else {
        // Regrouper les prestations par clientName
        const clientsWithPrestations = rows.reduce((acc, row) => {
          const client = acc[row.clientName] || {
            clientName: row.clientName,
            prestations: [],
            totalCA: 0,
          };
          client.prestations.push({
            prestationType: row.prestationType,
            date: row.date,
            price: row.price,
            provider: row.provider,
          });
          client.totalCA += row.price;
          acc[row.clientName] = client;
          return acc;
        }, {});
        res.json(Object.values(clientsWithPrestations));
      }
    }
  );
});
router.get("/mental-preparation", (req, res) => {
  db.all(
    `SELECT clientName, prestationType, date, price, provider, startDate, endDate, sessionType, excludeFromObjectives 
       FROM prestations 
       WHERE prestationType = 'Préparation mentale'`,
    [],
    (err, rows) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération des prestations :",
          err.message
        );
        res
          .status(500)
          .json({ error: "Erreur lors de la récupération des prestations." });
      } else {
        const mentalPreparationData = rows.reduce((acc, row) => {
          const client = acc[row.clientName] || {
            clientName: row.clientName,
            prestations: [],
            totalCA: 0,
          };
          client.prestations.push({
            prestationType: row.prestationType,
            date: row.date,
            price: row.price,
            provider: row.provider,
            startDate: row.startDate,
            endDate: row.endDate,
            sessionType: row.sessionType,
            excludeFromObjectives: row.excludeFromObjectives,
          });
          client.totalCA += row.excludeFromObjectives ? 0 : row.price; // N'ajouter au CA que si non exclu
          acc[row.clientName] = client;
          return acc;
        }, {});
        res.json(Object.values(mentalPreparationData));
      }
    }
  );
});

router.get("/mental-preparation/stats", (req, res) => {
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
        res
          .status(500)
          .json({ error: "Erreur lors de la récupération des statistiques." });
      } else {
        res.json(rows);
      }
    }
  );
});

module.exports = router;
