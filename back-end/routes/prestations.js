const express = require("express");
const Joi = require("joi");
const pool = require("../connexionDB");

const router = express.Router();

// Schéma de validation pour les prestations
const prestationSchema = Joi.object({
  clientName: Joi.string().required(),
  prestationType: Joi.string().required(),
  date: Joi.date().required(),
  price: Joi.number().required(),
  provider: Joi.string().required(),
  sessionType: Joi.string().allow(null, ""), // ✅ Permet `null` et une chaîne vide
  startDate: Joi.date().allow(null),
  endDate: Joi.date().allow(null),
  excludeFromObjectives: Joi.boolean().optional(),
});

// Route : Récupérer les noms de clients distincts
router.get("/clients", async (req, res, next) => {
  try {
    console.log("🔍 Requête API reçue : GET /clients");

    // Exécution de la requête SQL
    const { rows } = await pool.query(
      "SELECT DISTINCT clientName FROM prestations"
    );

    console.log("✅ Données SQL récupérées :", rows);

    // Vérification : on s'assure que la réponse est un tableau
    if (!Array.isArray(rows)) {
      console.warn(
        "⚠️ La réponse SQL n'est pas un tableau. Correction en cours..."
      );
      return res.status(200).json([]);
    }

    // Vérification : formatage des données si nécessaire
    const formattedClients = rows.map((row) => ({
      clientName: row.clientname || row.clientName || "Client inconnu",
    }));

    console.log("📦 Données envoyées au frontend :", formattedClients);

    res.status(200).json(formattedClients);
  } catch (err) {
    console.error("❌ Erreur lors de la requête SQL :", err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Route : Récupérer toutes les prestations
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM prestations");
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// Route : Récupérer une prestation par ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM prestations WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Prestation introuvable." });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Route : Ajouter une nouvelle prestation
router.post("/", async (req, res, next) => {
  try {
    console.log("🔍 Données reçues du frontend :", req.body);

    const data = await prestationSchema.validateAsync(req.body);

    console.log("✅ Données validées :", data);

    const query = `
          INSERT INTO prestations (clientName, prestationType, date, price, provider, sessionType, startDate, endDate, excludeFromObjectives) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
      `;
    const values = [
      data.clientName,
      data.prestationType,
      data.date,
      data.price,
      data.provider,
      data.sessionType || null,
      data.startDate || null,
      data.endDate || null,
      data.excludeFromObjectives || false,
    ];

    console.log("📦 Exécution SQL avec valeurs :", values);

    const { rows } = await pool.query(query, values);
    res.status(201).json({
      message: "Prestation ajoutée avec succès !",
      prestationId: rows[0].id,
    });
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout de la prestation :", err);
    res.status(500).json({
      error: "Erreur lors de l'ajout de la prestation.",
      details: err.message,
    });
  }
});

// Route : Mettre à jour une prestation par ID
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await prestationSchema.validateAsync(req.body);
    const query = `
      UPDATE prestations 
      SET clientName = $1, prestationType = $2, date = $3, price = $4, provider = $5, sessionType = $6, startDate = $7, endDate = $8, excludeFromObjectives = $9 
      WHERE id = $10
    `;
    const values = [
      data.clientName,
      data.prestationType,
      data.date,
      data.price,
      data.provider,
      data.sessionType || null,
      data.startDate || null,
      data.endDate || null,
      data.excludeFromObjectives || false,
      id,
    ];
    const { rowCount } = await pool.query(query, values);
    if (rowCount === 0) {
      return res.status(404).json({ error: "Prestation introuvable." });
    }
    res.status(200).json({ message: "Prestation mise à jour avec succès !" });
  } catch (err) {
    next(err);
  }
});

// Route : Supprimer une prestation par ID
router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM prestations WHERE id = $1",
      [id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Prestation introuvable." });
    }
    res.status(200).json({ message: "Prestation supprimée avec succès !" });
  } catch (err) {
    next(err);
  }
});

// Route : Statistiques de préparation mentale
router.get("/stats/mental-preparation", async (req, res, next) => {
  try {
    const query = `
      SELECT 
        EXTRACT(YEAR FROM date) AS year, 
        EXTRACT(QUARTER FROM date) AS quarter, 
        COUNT(DISTINCT clientName) AS clients, 
        COUNT(*) AS prestations, 
        SUM(price) AS ca
      FROM prestations
      WHERE prestationType = 'Préparation mentale'
      GROUP BY year, quarter
      ORDER BY year, quarter
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/client/:clientName", async (req, res, next) => {
  console.log("🔍 Route /prestations/client/:clientName atteinte");
  let rawClientName = req.params.clientName;
  let clientName = decodeURIComponent(rawClientName).trim().replace(/\n/g, ""); // Nettoyage

  console.log("🔍 Nom du client brut :", rawClientName);
  console.log("🔍 Après décodage et nettoyage :", clientName);

  try {
    const sqlQuery =
      "SELECT * FROM prestations WHERE LOWER(TRIM(clientname)) = LOWER(TRIM($1))";
    console.log("🔍 Exécution SQL avec paramètre :", clientName);

    const { rows } = await pool.query(sqlQuery, [clientName]);

    console.log("🔍 Résultat de la requête SQL :", rows);

    if (rows.length === 0) {
      console.warn("⚠️ Aucun client trouvé :", clientName);
      return res.status(404).json({ message: "Client non trouvé" });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error(
      "Erreur lors de la récupération des données du client :",
      err
    );
    next(err);
  }
});

module.exports = router;
