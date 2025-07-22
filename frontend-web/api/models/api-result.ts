export type ApiResultDto<T> = {
  success: boolean;
  data: T;
  errorCode?: string;
}