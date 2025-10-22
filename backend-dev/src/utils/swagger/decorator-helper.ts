import { ApiResponseNoStatusOptions } from "@nestjs/swagger";

export function withResponseBinaryOption(mime = "application/octet-stream", description?: string): ApiResponseNoStatusOptions {
  return {
    description,
    content: {
      [mime]: {
        schema: {
          type: "string",
          format: "binary",
        },
      },
    },
  };
}
