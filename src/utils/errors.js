import ApiError from "./ApiError.js";

export class AppError extends ApiError {
  constructor(message, statusCode) {
    super(statusCode, message);
  }
}
