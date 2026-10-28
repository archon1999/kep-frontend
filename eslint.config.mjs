import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  { ignores: ['dist', 'output/**', 'vite.config.ts', 'orval.config.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      'react-refresh/only-export-components': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/purity': 'off',
      // Disable all strict rules from react-hooks 7.0.0
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'import/no-webpack-loader-syntax': 'off',
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@mui/system',
              message: 'Import from @mui/system is not allowed. Use @mui/material instead.',
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/**/ui/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            { name: '@mui/system', message: 'Use @mui/material instead.', allowTypeImports: true },
            { name: 'axios', message: 'UI must use application queries and mutations.' },
            {
              name: 'swr',
              importNames: ['default'],
              message: 'Define fetching hooks in application/queries.ts.',
            },
            {
              name: 'swr/infinite',
              message: 'Define pagination fetching in application/queries.ts.',
            },
            { name: 'swr/mutation', message: 'Define mutations in application/mutations.ts.' },
          ],
          patterns: [
            {
              group: ['**/data-access', '**/data-access/**', 'shared/api/**', '**/shared/api/**'],
              message:
                'UI depends on application operations and domain models, not transports or DTOs.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/**/ui/pages/**/*Page.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportDeclaration[source.value=/application.*(queries|mutations)/]',
          message:
            'Route pages compose UI; coordinate queries and mutations in an application hook.',
        },
      ],
    },
  },
  {
    files: ['src/modules/**/application/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/ui',
                '**/ui/**',
                'shared/components/**',
                '**/shared/components/**',
                '@mui/**',
              ],
              message:
                'Application orchestrates data and actions; rendering and component state belong in UI.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/**/domain/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                'react/**',
                'react-dom',
                'react-dom/**',
                '@mui/**',
                'swr',
                'swr/**',
                'axios',
                '**/application/**',
                '**/data-access/**',
                '**/ui/**',
              ],
              message:
                'Domain contracts and helpers must stay independent of UI, fetching, and repository implementations.',
            },
          ],
        },
      ],
    },
  },
);
