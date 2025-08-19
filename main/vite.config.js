import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // ✅ Import path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ Shortcut for /src
    },
  },
  server: {
    host: true,        // ✅ Allow access from any host (0.0.0.0)
    port: 5173,        // (optional) default dev server port
    strictPort: false, // (optional) allows fallback if port is busy
    cors: true,        // ✅ Enable CORS for all origins
  },
  preview: {
    host: true,        // ✅ Also allow any host when running `vite preview`
    port: 4173,        // (optional) preview port
    cors: true,        // ✅ Enable CORS in preview mode too
  },
});
