import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ApiResult<T> {
  @ApiProperty()
  @Expose()
  success: boolean;

  @ApiProperty()
  @Expose()
  data?: T;

  constructor(param?: { success?: boolean; data?: T }) {
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
  }
}
