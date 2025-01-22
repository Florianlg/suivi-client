require("dotenv").config();
const pool = require("./connexionDB");

// Vérifier et créer la table si elle n'existe pas
async function ensureTableExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS prestations (
      id SERIAL PRIMARY KEY,
      clientName VARCHAR(255) NOT NULL,
      prestationType VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      provider VARCHAR(255) NOT NULL,
      startDate DATE,
      endDate DATE,
      sessionType VARCHAR(255),
      excludeFromObjectives BOOLEAN DEFAULT FALSE
    )
  `;
  try {
    await pool.query(createTableQuery);
    console.log('Table "prestations" vérifiée/créée.');
  } catch (err) {
    console.error("Erreur lors de la création de la table :", err.message);
  }
}

// Exécuter la fonction
(async function manageTable() {
  await ensureTableExists();
})();
