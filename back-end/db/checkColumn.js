const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Chemin vers la base de données SQLite
const dbPath = path.resolve(__dirname, "suiviClient.db");

// Ouvrir la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(
      "Erreur lors de l'ouverture de la base de données :",
      err.message
    );
  } else {
    console.log("Connexion réussie à la base de données.");
    checkColumns(); // Appeler la fonction pour vérifier les colonnes
  }
});

// Fonction pour lister les colonnes
function checkColumns() {
  db.all(`PRAGMA table_info(prestations);`, (err, columns) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des colonnes :",
        err.message
      );
    } else {
      console.log("Colonnes de la table 'prestations' :");
      columns.forEach((column) => {
        console.log(`Nom: ${column.name}, Type: ${column.type}`);
      });
    }
    db.close(); // Fermer la base de données après vérification
  });
}
