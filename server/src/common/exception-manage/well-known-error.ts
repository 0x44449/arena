export class WellKnownError extends Error {
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
    this.statusCode = param?.statusCode;
    this.errorCode = param?.errorCode;
  }
}