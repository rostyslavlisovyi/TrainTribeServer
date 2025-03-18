import { BaseError } from "./baseError.js";

export class DatabaseConnectionError extends BaseError {
  constructor(details?: string) {
    super(
      "Database connection error",
      503,
      true,
      details ? { details } : undefined
    );
  }
}

export class NetworkError extends BaseError {
  constructor(details?: string) {
    super("Network error", 503, true, details ? { details } : undefined);
  }
}
