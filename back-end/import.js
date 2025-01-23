const fs = require("fs");
const csv = require("csv-parser");
const pool = require("./connexionDB");

async function importCSV(filePath) {
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        for (const row of results) {
          await pool.query(
            `INSERT INTO prestations (clientName, prestationType, date, price, provider, startDate, endDate, sessionType, excludeFromObjectives)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              row.clientName,
              row.prestationType,
              row.date,
              row.price,
              row.provider,
              row.startDate || null,
              row.endDate || null,
              row.sessionType || null,
              row.excludeFromObjectives || false,
            ]
          );
        }
        console.log("Importation terminée avec succès !");
      } catch (err) {
        console.error("Erreur lors de l'importation :", err.message);
      } finally {
        pool.end();
      }
    });
}

// Lancer l'importation
importCSV("./db/prestations.csv");
