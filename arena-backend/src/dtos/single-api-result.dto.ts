import type { Type } from "@nestjs/common";
import { ApiResultDto } from "./api-result.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SingleApiResultDto<T> extends ApiResultDto {
  data: T;
}

export function withSingleApiResult<T>(Model: Type<T>, options?: { nullable?: boolean }) {
  const { nullable = false } = options || {};

  class SingleApiResultDtoWithModel extends SingleApiResultDto<T> {
    @ApiProperty({
      type: () => Model,
      nullable: nullable,
    })
    declare data: T;
  }
  Object.defineProperty(SingleApiResultDtoWithModel, 'name', { value: `${Model.name}${nullable ? "_Nullable" : ""}_Result` });
  return SingleApiResultDtoWithModel;
}