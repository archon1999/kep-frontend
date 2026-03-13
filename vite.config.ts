import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export default ({ mode }) => {
  loadEnv(mode, process.cwd(), '');

  return defineConfig({
    build: {
      sourcemap: false,
    },
    plugins: [
      tsconfigPaths(),
      react(),
      // checker({
      //   typescript: true,
      //   eslint: {
      //     useFlatConfig: true,
      //     lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      //   },
      //   overlay: {
      //     initialIsOpen: false,
      //   },
      // }),
    ],
    server: {
      host: '0.0.0.0',
      port: 4200,
    },
    base: '/',
  });
};
