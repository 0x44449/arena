import { defineConfig } from 'orval';

export default defineConfig({
  "arena": {
    input: {
      target: "http://localhost:8002/swagger-json",
    },
    output: {
      mode: "tags-split",
      namingConvention: "kebab-case",
      target: "./api/generated/endpoints",
      schemas: "./api/generated/models",
      client: "react-query",
      override: {
        mutator: {
          path: "./api/api-client.ts",
          name: "apiClientProxy",
        },
        operationName: (operation, route, verb) => {
          const originalName = operation.operationId; 

          if (verb === 'get') {
            return `${originalName}Query`; 
          } else {
            return `${originalName}Mutation`; 
          }
        }
      }
    }
  },
});