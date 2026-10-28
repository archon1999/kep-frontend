import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import seoDocuments from './scripts/seo/vite-seo.mjs';

export default ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isBuild = command === 'build';
  const useDevApiProxy = !isBuild && env.VITE_DEV_API_PROXY === 'true' && !!env.VITE_API_URL;

  return defineConfig({
    build: {
      sourcemap: false,
      manifest: true,
      rollupOptions: {
        output: {
          // Keep feature engines separate from the shell. Including each vendor's
          // dependencies avoids circular imports back into the app entry chunk.
          manualChunks(id) {
            const moduleId = id.replaceAll('\\', '/');
            if (moduleId.includes('commonjsHelpers.js')) return 'react-runtime';
            if (!moduleId.includes('/node_modules/')) return;
            // Fiber carries its own scheduler; keep that second runtime with the game.
            if (moduleId.includes('/node_modules/@react-three/fiber/')) return 'react-three';
            if (
              /\/node_modules\/(react|react-dom|scheduler|use-sync-external-store)\//.test(moduleId)
            )
              return 'react-runtime';
            if (/\/node_modules\/react-router\//.test(moduleId)) return 'router';
            if (
              /\/node_modules\/(@iconify\/react|sonner|simplebar-core|simplebar-react)\//.test(
                moduleId,
              )
            )
              return 'ui-runtime';
            if (
              /\/node_modules\/(@emotion\/|@mui\/(material|system|utils|private-theming|styled-engine)\/|@popperjs\/)/.test(
                moduleId,
              )
            )
              return 'mui';
            if (
              /\/node_modules\/(i18next|react-i18next|i18next-browser-languagedetector)\//.test(
                moduleId,
              )
            )
              return 'i18n-runtime';
            if (
              /\/node_modules\/(axios|swr|@tanstack\/query-core|@tanstack\/react-query)\//.test(
                moduleId,
              )
            )
              return 'data-runtime';
            if (moduleId.includes('/node_modules/three/build/three.core.js')) return 'three-core';
            if (moduleId.includes('/node_modules/three/')) return 'three-renderer';
            if (moduleId.includes('/node_modules/zrender/')) return 'chart-renderer';
          },
        },
      },
    },
    define: isBuild
      ? {
          'import.meta.env.VITE_BASIC_AUTH_LOGIN': 'undefined',
          'import.meta.env.VITE_BASIC_AUTH_PASSWORD': 'undefined',
        }
      : useDevApiProxy
        ? {
            'import.meta.env.VITE_API_URL': JSON.stringify(''),
            'import.meta.env.VITE_WS_URL': JSON.stringify(''),
          }
        : undefined,
    plugins: [
      tsconfigPaths(),
      react(),
      seoDocuments(),
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
      entries: ['index.html'],
      include: ['@hookform/resolvers/yup', 'react-hook-form', 'yup'],
    },
    server: {
      host: '0.0.0.0',
      port: 4200,
      proxy: useDevApiProxy
        ? {
            '/api': { target: env.VITE_API_URL, changeOrigin: true },
            '/ws/': {
              target:
                env.VITE_WS_URL || new URL('/ws/', env.VITE_API_URL).href.replace(/^http/, 'ws'),
              ws: true,
              changeOrigin: true,
              ignorePath: true,
              // Preserve the browser Origin: the backend still validates its allowlist.
            },
          }
        : undefined,
    },
    base: '/',
  });
};
