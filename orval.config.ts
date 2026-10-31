import { defineConfig } from 'orval';

const schema = process.env.KEP_OPENAPI_SCHEMA || 'https://kep.uz/swagger/?format=openapi';

export default defineConfig({
  // Scope this feature to its new contract. The legacy full schema contains
  // duplicate operationIds and is maintained by its existing generator config.
  keplangPlayground: {
    input: {
      target: schema,
      override: {
        transformer: (spec) => ({
          ...spec,
          paths: Object.fromEntries(
            Object.entries(spec.paths ?? {}).filter(([path]) =>
              path.startsWith('/api/playground/'),
            ),
          ),
        }),
      },
      filters: { mode: 'include', schemas: ['Run', 'RunResult', 'PublicLanguage'] },
    },
    output: {
      mode: 'split',
      target: 'src/shared/api/orval/generated/playground/index.ts',
      client: 'axios',
      override: {
        mutator: {
          path: 'src/shared/api/http/axiosMutator.ts',
          name: 'axiosMutator',
        },
      },
    },
    hooks: { afterAllFilesWrite: 'prettier --write' },
  },
});
