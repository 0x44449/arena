import { ApiProperty } from "@nestjs/swagger";

export class ApiResultDto<T> {
  @ApiProperty() success: boolean;
  @ApiProperty() data?: T;
  @ApiProperty() errorCode?: string;

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