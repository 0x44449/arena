export type ApiResult<T> = {
  success: boolean;
  data?: T;
  errorCode?: string;
}