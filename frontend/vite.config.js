import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false, // Désactive la minification pour un débogage plus facile (optionnel)
  },
});
