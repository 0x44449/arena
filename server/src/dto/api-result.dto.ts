import { Expose } from "class-transformer";

export class ApiResult<T> {
  @Expose()
  success: boolean;
  @Expose()
  data?: T;
  @Expose()
  errorMessage?: string;
  @Expose()
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
      this.errorMessage = param.errorMessage;
      this.errorCode = param.errorCode;
    }
  }
}
