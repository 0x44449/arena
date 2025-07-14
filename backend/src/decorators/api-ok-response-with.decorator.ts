import { ApiResult } from "@/dtos/api-result.dto";
import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiResponseNoStatusOptions, getSchemaPath } from "@nestjs/swagger";

interface ApiOkResponseWithResultOptions {
  isArray?: boolean;
  description?: string;
}

export function ApiOkResponseWith<T>(model?: Type<T>, resultOptions?: ApiOkResponseWithResultOptions, options?: ApiResponseNoStatusOptions): MethodDecorator {
  if (model === undefined) {
    return applyDecorators(
      ApiExtraModels(ApiResult),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResult) },
            {
              properties: {
                data: { type: 'null', nullable: true },
              }
            }
          ],
        },
        ...options,
      }),
    );
  }

  const { isArray = false } = resultOptions || {};
  const dataSchema = isArray
    ? {
      type: 'array',
      items: { $ref: getSchemaPath(model) },
    }
    : {
      $ref: getSchemaPath(model),
    };
  return applyDecorators(
    ApiExtraModels(ApiResult, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResult) },
          {
            properties: {
              data: dataSchema,
            },
          },
        ],
      },
      ...options,
    }),
  )
}