import { BaseError } from "./baseError.js";

export class InternalServerError extends BaseError {
  constructor(details?: string) {
    super(
      "Internal Server Error",
      500,
      false,
      details ? { details } : undefined
    );
  }
}
