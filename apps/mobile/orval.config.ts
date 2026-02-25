import { defineConfig } from "orval";

export default defineConfig({
  arena: {
    input: {
      target: "./api/swagger.json",
      validation: false,
    },
    output: {
      target: "./api/generated",
      mode: "tags-split",
      client: "axios",
      override: {
        mutator: {
          path: "./api/api-client.ts",
          name: "apiClientProxy",
        },
      },
    },
  },
});
