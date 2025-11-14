import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// This function finds all your project folders (like fixtures, standings, etc.)
// that contain an HTML file with the same name.
const pages = fs.readdirSync(resolve(__dirname))
  .filter(dir => {
    try {
      return fs.statSync(resolve(__dirname, dir)).isDirectory() && 
             fs.existsSync(resolve(__dirname, dir, `${dir}.html`));
    } catch (error) {
      return false;
    }
  });

// This builds the list of all HTML files for Vite
const rollupInputs = {
  main: resolve(__dirname, 'index.html'),
  ...pages.reduce((acc, dir) => {
    acc[dir] = resolve(__dirname, dir, `${dir}.html`);
    return acc;
  }, {})
};

// This is the final Vite config
export default defineConfig({
  build: {
    rollupOptions: {
      input: rollupInputs,
    },
  },
});