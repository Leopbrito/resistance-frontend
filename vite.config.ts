import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// package.json é a única fonte da versão (o workflow da imagem usa o mesmo valor)
const { version } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8"));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  resolve: {
    alias: {
      // Alias @ to the src directory
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Vendors em chunks próprios: o cache sobrevive a deploys que só mudam o app
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/node_modules\/(motion|framer-motion|motion-dom|motion-utils)\//.test(id))
            return "motion";
          if (/node_modules\/(react|react-dom|react-router|scheduler)\//.test(id)) return "react";
          if (
            /node_modules\/(socket\.io-client|socket\.io-parser|engine\.io-client|engine\.io-parser|@socket\.io)\//.test(
              id,
            )
          )
            return "socket";
        },
      },
    },
  },

  assetsInclude: ["**/*.svg", "**/*.csv"],
});
