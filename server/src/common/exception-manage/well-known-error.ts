export class WellKnownError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errorCode: string,
  ) {
    super(message);
    this.name = 'WellKnownError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}