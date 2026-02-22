import { defineConfig } from 'orval';

export default defineConfig({
  arena: {
    input: {
      target: './api/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './api/generated/endpoints',
      schemas: './api/generated/models',
      client: 'react-query',
      override: {
        mutator: {
          path: './api/api-client.ts',
          name: 'apiClientProxy',
        },
      },
    },
  },
});
