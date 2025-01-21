import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

export default defineConfig({
  root: './demo', // The app root during development
  plugins: [
    externalizeDeps(),
    dts({
      exclude: ['src'],
    }),
  ],
  build: {
    outDir: '../dist', // relative to root (above)
    emptyOutDir: true,
    minify: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'HyperMD',
      formats: ['es'],
      // the proper extensions will be added
      fileName: (_, entryName) => `${entryName}.mjs`,
    },
  },
});
