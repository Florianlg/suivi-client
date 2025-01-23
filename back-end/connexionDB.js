require("dotenv").config({ path: "../.env" });
const { Pool } = require("pg");

console.log("Configuration :");
console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
    ? "Mot de passe présent"
    : "Mot de passe manquant",
  database: process.env.DB_NAME,
});

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Vérifie que c'est bien une chaîne de caractères
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Pour Neon
  },
});

// Tester la connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.message);
    console.error("Détails complets :", err);
  } else {
    console.log("Connexion réussie à PostgreSQL !");
    release(); // Libère la connexion après le test
  }
});

module.exports = pool;
