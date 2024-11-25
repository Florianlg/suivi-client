const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Chemin vers la base de données SQLite
const dbPath = path.resolve(__dirname, "suiviClient.db");

// Créer ou ouvrir la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(
      "Erreur lors de l’ouverture de la base de données :",
      err.message
    );
  } else {
    console.log("Connexion à SQLite réussie");
  }
});

// Créer une table si elle n’existe pas
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS prestations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
  clientName TEXT NOT NULL,
  prestationType TEXT NOT NULL,
  date TEXT NOT NULL,
  price REAL NOT NULL,
  provider TEXT NOT NULL,
  startDate TEXT,
  endDate TEXT,
  sessionType TEXT
    )
    `,
    (err) => {
      if (err) {
        console.error("Erreur lors de la création de la table :", err.message);
      } else {
        console.log('Table "prestations" vérifiée/créée');
      }
    }
  );
});

// Fonction pour ajouter une colonne
function addColumn() {
  const columnName = "excludeFromObjectives";
  const columnType = "BOOLEAN DEFAULT 0";

  db.get(`PRAGMA table_info(prestations)`, (err, tableInfo) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des informations de la table :",
        err.message
      );
      return;
    }

    // Vérifier si la colonne existe déjà
    const columns = tableInfo.map((col) => col.name);
    if (columns.includes(columnName)) {
      console.log(
        `La colonne "${columnName}" existe déjà dans la table "prestations".`
      );
    } else {
      // Ajouter la colonne si elle n'existe pas
      db.run(
        `ALTER TABLE prestations ADD COLUMN ${columnName} ${columnType}`,
        (err) => {
          if (err) {
            console.error(
              "Erreur lors de l'ajout de la colonne :",
              err.message
            );
          } else {
            console.log(`Colonne "${columnName}" ajoutée avec succès !`);
          }
        }
      );
    }
  });
}

module.exports = db;
