import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Required for SSE communication
      '/sse': 'http://localhost:8080',

      // Allows fetching of CSRF authentication tokens
      '/csrf': 'http://localhost:8080',

      // Allows accessing login page *without* HRM and sending auth requests 
      '/login.html': {
        target: 'http://localhost:8080',
        bypass(req) {
          if (req.method !== 'POST') {
            return '/login.html';
          }
        },
      },
    },
  },
});
