import type { Type } from "@nestjs/common";
import { ApiResultDto } from "./api-result.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SingleApiResultDto<T> extends ApiResultDto {
  data: T;
}

export function withSingleApiResult<T>(Model: Type<T>) {
  class SingleApiResultDtoWithModel extends SingleApiResultDto<T> {
    @ApiProperty({
      type: () => Model,
    })
    declare data: T;
  }
  Object.defineProperty(SingleApiResultDtoWithModel, 'name', { value: `SingleApiResultDto_${Model.name}` });
  return SingleApiResultDtoWithModel;
}