export class CustomError extends Error {
  constructor(message, statusCode, name) {
    super(message);
    this.status = statusCode;
    this.name = name;
  }
}
