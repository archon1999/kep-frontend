import { defineConfig } from 'orval';

const OUTPUT_PATH = 'src/shared/api/orval';

export default defineConfig({
  kepApi: {
    input: 'https://kep.uz/swagger/?format=openapi',
    output: {
      target: `${OUTPUT_PATH}/endpoints.ts`,
      schemas: `${OUTPUT_PATH}/schemas`,
      client: 'axios',
      clean: true,
      override: {
        mutator: {
          path: './src/shared/services/axios/axiosInstance',
          name: 'axiosInstance',
          default: true,
        },
      },
    },
  },
});
