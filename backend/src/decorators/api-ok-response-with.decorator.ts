import { ApiResultDto } from "@/dtos/api-result.dto";
import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiResponseNoStatusOptions, getSchemaPath } from "@nestjs/swagger";

interface ApiOkResponseWithResultOptions {
  isArray?: boolean;
  description?: string;
}

export function ApiOkResponseWith<T>(model?: Type<T>, resultOptions?: ApiOkResponseWithResultOptions, options?: ApiResponseNoStatusOptions): MethodDecorator {
  if (model === undefined) {
    return applyDecorators(
      ApiExtraModels(ApiResultDto),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResultDto) },
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
    ApiExtraModels(ApiResultDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResultDto) },
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