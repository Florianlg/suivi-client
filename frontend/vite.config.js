import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, // Désactive la minification pour un débogage plus facile (optionnel)
  },
  define: {
    "process.env": {}, // Assure que `process.env` ne provoque pas d'erreur, bien que Vite utilise `import.meta.env`
  },
});
