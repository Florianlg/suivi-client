require("dotenv").config();
const mysql = require("mysql2");
const pool = require("./db"); // Utilisation d’un pool centralisé

// Vérifier et créer la table si elle n'existe pas
async function ensureTableExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS prestations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      clientName VARCHAR(255) NOT NULL,
      prestationType VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      provider VARCHAR(255) NOT NULL,
      startDate DATE,
      endDate DATE,
      sessionType VARCHAR(255),
      excludeFromObjectives BOOLEAN DEFAULT 0
    )
  `;
  try {
    await pool.query(createTableQuery);
    console.log('Table "prestations" vérifiée/créée.');
  } catch (err) {
    console.error("Erreur lors de la création de la table :", err.message);
  }
}

// Ajouter une colonne si elle n'existe pas
async function ensureColumnExists(columnName, columnType) {
  try {
    const [columns] = await pool.query("DESCRIBE prestations");
    const columnNames = columns.map((col) => col.Field);

    if (!columnNames.includes(columnName)) {
      await pool.query(
        `ALTER TABLE prestations ADD COLUMN ${columnName} ${columnType}`
      );
      console.log(`Colonne "${columnName}" ajoutée avec succès !`);
    } else {
      console.log(`La colonne "${columnName}" existe déjà.`);
    }
  } catch (err) {
    console.error(
      "Erreur lors de la vérification ou de l'ajout de la colonne :",
      err.message
    );
  }
}

// Lister les colonnes de la table
async function listColumns() {
  try {
    const [columns] = await pool.query("DESCRIBE prestations");
    console.log("Colonnes de la table 'prestations' :");
    columns.forEach((column) => {
      console.log(`Nom: ${column.Field}, Type: ${column.Type}`);
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des colonnes :", err.message);
  }
}

// Exécuter les fonctions nécessaires
(async function manageTable() {
  await ensureTableExists();
  await ensureColumnExists("excludeFromObjectives", "BOOLEAN DEFAULT 0");
  await listColumns();
})();
