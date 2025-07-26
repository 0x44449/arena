export class UnauthorizedError extends Error {
  errorCode?: string;

  constructor(param?: { message: string; errorCode?: string }) {
    super(param?.message);
    this.name = 'UnauthorizedError';
    this.errorCode = param?.errorCode;
  }
}