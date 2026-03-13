import { defineConfig } from 'orval';

export default defineConfig({
  myApi: {
    input: 'https://kep.uz/swagger/?format=openapi',
    output: {
      mode: 'split',
      target: './generated/endpoints/index.ts',
      client: 'axios',
      override: {
        mutator: {
          path: '../http/axiosMutator.ts',
          name: 'axiosMutator',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
  zodGen: {
    input: {
      target: 'https://kep.uz/swagger/?format=openapi',
    },
    output: {
      target: './generated/schemas/index.ts',
      client: 'zod',
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
