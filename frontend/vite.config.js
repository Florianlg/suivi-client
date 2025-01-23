import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config(); // Charge les variables du fichier .env

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, // Désactiver la minification pour déboguer plus facilement
  },
});

console.log(import.meta.env); // Pour vérifier les variables chargées
