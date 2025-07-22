import { ApiResultDto } from '@/dtos/api-result.dto';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

export type DataSchemaFactory = {
  (ref: (m: any) => any): any;
  models?: Type<any>[];
};

const refOf = (m: any) => ({ $ref: getSchemaPath(m) });

export function ApiOkResultWith(
  factory: DataSchemaFactory,
  options?: ApiResponseOptions,
): MethodDecorator {
  const extraModels = factory.models ?? [];
  return applyDecorators(
    ApiExtraModels(ApiResultDto, ...extraModels),
    ApiOkResponse({
      schema: {
        allOf: [
          refOf(ApiResultDto),
          {
            properties: {
              data: factory(refOf),
            },
          },
        ],
      },
      ...options,
    }),
  );
}