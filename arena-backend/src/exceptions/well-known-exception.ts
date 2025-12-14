export class WellKnownException extends Error {
  statusCode?: number;
  errorCode?: string;
  
  constructor(
    public param?: {
      message: string;
      statusCode?: number;
      errorCode?: string;
    }
  ) {
    super(param?.message);
    this.name = 'WellKnownError';
    this.statusCode = param?.statusCode ?? 200;
    this.errorCode = param?.errorCode;
  }
}