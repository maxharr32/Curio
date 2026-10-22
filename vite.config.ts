import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps asset paths relative, so the build works on GitHub Pages
// (any repo name) as well as on a custom domain.
export default defineConfig({
  base: './',
  plugins: [react()],
});
