import { BaseError } from "./baseError.ts";

export class NotFoundError extends BaseError {
  constructor(message = "NOT FOUND") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}
