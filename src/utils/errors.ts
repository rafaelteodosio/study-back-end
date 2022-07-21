export class ServiceError extends Error {
  status_code: number;

  constructor(message: string, status_code: number = 500) {
    super(message);
    this.status_code = status_code;
  }
}
