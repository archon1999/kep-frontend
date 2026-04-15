import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

export default ({ mode, command }) => {
  loadEnv(mode, process.cwd(), '');
  const isBuild = command === 'build';

  return defineConfig({
    build: {
      sourcemap: false,
    },
    plugins: [
      tsconfigPaths(),
      react(),
      !isBuild &&
        checker({
          typescript: true,
          eslint: {
            useFlatConfig: true,
            lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
          },
          overlay: {
            initialIsOpen: false,
          },
        }),
    ],
    resolve: {
      alias: {
        'react-router-dom': 'react-router',
      },
    },
    optimizeDeps: {
      include: ['@hookform/resolvers/yup', 'react-hook-form', 'yup'],
    },
    server: {
      host: '0.0.0.0',
      port: 4200,
    },
    base: '/',
  });
};
