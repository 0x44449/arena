import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";

export function ApiOkResponseBinary(contentType: string = 'application/octet-stream') {
  return applyDecorators(
    ApiOkResponse({
      content: {
        [contentType]: {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
  );
}