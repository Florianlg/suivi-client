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
  sessionType: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  excludeFromObjectives: Joi.boolean().optional(),
});

// Route : Récupérer les noms de clients distincts
router.get("/clients", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT DISTINCT clientName FROM prestations"
    );
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// Route : Récupérer toutes les prestations
router.get("/", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM prestations");
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// Route : Récupérer une prestation par ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM prestations WHERE id = ?", [
      id,
    ]);
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
    const data = await prestationSchema.validateAsync(req.body);
    const query = `
      INSERT INTO prestations (clientName, prestationType, date, price, provider, sessionType, startDate, endDate, excludeFromObjectives) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      data.clientName,
      data.prestationType,
      data.date,
      data.price,
      data.provider,
      data.sessionType || null,
      data.startDate || null,
      data.endDate || null,
      data.excludeFromObjectives || 0,
    ]);
    res.status(201).json({
      message: "Prestation ajoutée avec succès !",
      prestationId: result.insertId,
    });
  } catch (err) {
    next(err);
  }
});

// Route : Mettre à jour une prestation par ID
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await prestationSchema.validateAsync(req.body);
    const query = `
      UPDATE prestations 
      SET clientName = ?, prestationType = ?, date = ?, price = ?, provider = ?, sessionType = ?, startDate = ?, endDate = ?, excludeFromObjectives = ? 
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [
      data.clientName,
      data.prestationType,
      data.date,
      data.price,
      data.provider,
      data.sessionType || null,
      data.startDate || null,
      data.endDate || null,
      data.excludeFromObjectives || 0,
      id,
    ]);
    if (result.affectedRows === 0) {
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
    const [result] = await pool.query("DELETE FROM prestations WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
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
        YEAR(date) AS year, 
        QUARTER(date) AS quarter, 
        COUNT(DISTINCT clientName) AS clients, 
        COUNT(*) AS prestations, 
        SUM(price) AS ca
      FROM prestations
      WHERE prestationType = 'Préparation mentale'
      GROUP BY year, quarter
      ORDER BY year, quarter
    `;
    const [rows] = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
