import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // ✅ Import path module

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ This sets @ to point to /src
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "e79351ccecd9.ngrok-free.app", // ngrok domain
    ],
  },
});
