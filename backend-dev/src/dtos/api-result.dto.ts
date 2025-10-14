import { Type } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ApiResultDto<T> {
  success: boolean;
  data?: T;
  errorCode?: string;

  constructor(param?: { success?: boolean; data?: T; errorMessage?: string; errorCode?: string }) {
    this.success = true;
    this.data = undefined;

    if (param) {
      if (param.success !== undefined) {
        this.success = param.success;
      }
      if (param.data !== undefined) {
        this.data = param.data;
      }
    }

    if (param && !this.success) {
      this.errorCode = param.errorCode;
    }
  }
}

export function withApiResult<T>(Model: Type<T>) {
  class ApiResultDtoWithModel extends ApiResultDto<T> {
    @ApiProperty({
      type: () => Model,
    })
    declare data?: T;
  }

  Object.defineProperty(ApiResultDtoWithModel, 'name', { value: `ApiResultDto_${Model.name}` });

  return ApiResultDtoWithModel;
}