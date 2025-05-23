export default interface ApiResult<T> {
  success: boolean;
  data: T;
  errorMessage?: string;
  errorCode?: string;
}