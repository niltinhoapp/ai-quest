import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Permite hospedagem em qualquer subdiretório (GitHub Pages, Cloudflare Pages, etc.)
  server: {
    port: 3000,
    host: true
  }
});
