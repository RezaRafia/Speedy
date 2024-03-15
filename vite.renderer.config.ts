import { defineConfig } from 'vite';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss'

export default defineConfig({
  // plugins: [
  //   postcss({
  //     include: '**/*.css',
  //   }),
  // ],
  build: {
    outDir: 'dist/renderer/',
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
});