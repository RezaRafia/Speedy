import { defineConfig } from 'vite';
import postcss from 'rollup-plugin-postcss';

export default defineConfig({
  plugins: [
    postcss({
      include: '**/*.css',
    }),
  ],
  build: {
    outDir: 'dist',
  }
});