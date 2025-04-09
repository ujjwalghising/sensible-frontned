import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite';
import react from "@vitejs/plugin-react";
import path from 'path'; // Import the path module

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: "./",
  base: "/",
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Correct alias for the 'src' directory
      // Removed 'jwt-decode' alias
    },
  },
});
